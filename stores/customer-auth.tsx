import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { router, type Href } from "expo-router";

import { isValidEmailInput, normaliseAuthIdentifier, normaliseZambianPhone } from "@/lib/auth-flow";
import { MobileApiError } from "@/lib/api/errors";
import { addSessionExpiredListener } from "@/lib/api/session-events";
import { featureFlags } from "@/lib/config/feature-flags";
import type { StoredCustomer } from "@/lib/customer-session";
import type { AuthSession, OtpChallenge } from "@/lib/domain/auth";
import type { CustomerProfile as DomainCustomerProfile } from "@/lib/domain/customer";
import { removeSessionCsrfToken, removeSessionToken, setSessionCsrfToken, setSessionToken } from "@/lib/_core/auth";
import { repositories } from "@/lib/repositories";
import { clearStoredSession } from "@/lib/session-storage";
import { clearSecureSession, readSecureSession, writeSecureSession } from "@/lib/storage/secure-session-storage";
import { clearCache } from "@/lib/storage/cache-storage";
import { storageKeys } from "@/lib/storage/storage-keys";
import { useAppStartup } from "@/stores/app-startup";

export type CustomerProfile = StoredCustomer;

export type PendingAuthAttempt =
  | { mode: "sign-in"; channel: "phone" | "email"; destination: string }
  | {
      mode: "register";
      channel: "phone";
      destination: string;
      profile: { name: string; email: string; phone: string; city: string };
    };

type RegistrationDetails = { name: string; email: string; phone: string; city: string };
type RegistrationField = "name" | "email" | "phone" | "city" | "password";
type RegistrationErrors = Partial<Record<RegistrationField, string>>;

type AuthContextValue = {
  customer: CustomerProfile | null;
  isRestoring: boolean;
  pendingAuth: PendingAuthAttempt | null;
  authChallenge: OtpChallenge | null;
  authError: string;
  registrationErrors: RegistrationErrors;
  beginSignIn: (identifier: string) => void;
  beginRegistration: (details: RegistrationDetails & { password: string }) => Promise<boolean>;
  clearRegistrationError: (field: RegistrationField) => void;
  completeCredentialSignIn: (identifier: string, password: string, remember?: boolean) => Promise<boolean>;
  completeGoogleSignIn: () => Promise<boolean>;
  clearPendingAuth: () => void;
  completeVerification: (code?: string) => Promise<boolean>;
  requestPasswordReset: (identifier: string) => Promise<boolean>;
  resetPassword: (code: string, password: string) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  resendVerification: () => Promise<boolean>;
  updateProfile: (details: Pick<CustomerProfile, "name" | "phone">) => Promise<void>;
  signOut: () => Promise<void>;
};

const CustomerAuthContext = createContext<AuthContextValue | null>(null);

function customerFromSession(session: AuthSession): CustomerProfile {
  return {
    id: session.customer.id,
    name: session.customer.name,
    phone: session.customer.phone,
    ...(session.customer.email ? { email: session.customer.email } : {}),
    city: session.customer.city,
    ...(session.customer.avatarUrl ? { avatarUrl: session.customer.avatarUrl } : {}),
    ...(typeof session.customer.verified === "boolean" ? { verified: session.customer.verified } : {}),
    ...(session.customer.branchId ? { branchId: session.customer.branchId } : {}),
    portalEnabled: session.customer.portalEnabled,
  };
}

function domainCustomerFromStored(customer: CustomerProfile): DomainCustomerProfile {
  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    city: customer.city,
    ...(customer.email ? { email: customer.email } : {}),
    ...(customer.avatarUrl ? { avatarUrl: customer.avatarUrl } : {}),
    ...(typeof customer.verified === "boolean" ? { verified: customer.verified } : {}),
    ...(customer.branchId ? { branchId: customer.branchId } : {}),
    portalEnabled: customer.portalEnabled ?? true,
  };
}

async function persistAuthSession(session: AuthSession) {
  const nextCustomer = customerFromSession(session);
  const previousSession = await readSecureSession();
  const durableSession: AuthSession = {
    ...(previousSession ?? {}),
    ...session,
    ...(session.token ?? previousSession?.token ? { token: session.token ?? previousSession?.token } : {}),
    ...(session.csrfToken ?? previousSession?.csrfToken ? { csrfToken: session.csrfToken ?? previousSession?.csrfToken } : {}),
    customer: session.customer,
  };
  await Promise.all([
    writeSecureSession(durableSession),
    session.token ? setSessionToken(session.token) : Promise.resolve(),
    session.csrfToken ? setSessionCsrfToken(session.csrfToken) : Promise.resolve(),
  ]);
  return nextCustomer;
}

async function clearLocalCustomerState() {
  await Promise.all([
    clearStoredSession(),
    clearSecureSession(),
    removeSessionToken(),
    removeSessionCsrfToken(),
    clearCache(storageKeys.bookingDrafts),
    clearCache(storageKeys.shipmentCache),
    clearCache(storageKeys.trackingCache),
    clearCache(storageKeys.billingCache),
    clearCache(storageKeys.addressBookCache),
    clearCache("new-world-cargo.customer-data.v1"),
  ]);
}

export function CustomerAuthProvider({ children }: PropsWithChildren) {
  const { completeOnboarding } = useAppStartup();
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [pendingAuth, setPendingAuth] = useState<PendingAuthAttempt | null>(null);
  const [authChallenge, setAuthChallenge] = useState<OtpChallenge | null>(null);
  const [authError, setAuthError] = useState("");
  const [registrationErrors, setRegistrationErrors] = useState<RegistrationErrors>({});

  useEffect(() => {
    let active = true;

    let storedSession: AuthSession | null = null;
    void readSecureSession()
      .then((session) => {
        storedSession = session;
        return repositories.auth.restoreSession();
      })
      .then(async (remoteSession) => {
        if (!active) return;
        if (remoteSession?.customer) {
          const remoteCustomer = await persistAuthSession(remoteSession);
          setCustomer(remoteCustomer);
          return;
        }
        await clearLocalCustomerState();
        setCustomer(null);
      })
      .catch(async () => {
        if (!active) return;
        if (storedSession?.token && storedSession.customer.portalEnabled !== false) {
          setCustomer(customerFromSession(storedSession));
          return;
        }
        setCustomer(null);
      })
      .finally(() => {
        if (active) setIsRestoring(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => addSessionExpiredListener((error) => {
    void clearLocalCustomerState()
      .finally(() => {
        setCustomer(null);
        setPendingAuth(null);
        setAuthChallenge(null);
        setAuthError(error.message || "Your session expired. Please sign in again.");
        router.replace("/auth/session-expired" as Href);
      });
  }), []);

  useEffect(() => {
    if (customer) void completeOnboarding();
  }, [completeOnboarding, customer]);

  const value = useMemo<AuthContextValue>(() => ({
    customer,
    isRestoring,
    pendingAuth,
    authChallenge,
    authError,
    registrationErrors,
    beginSignIn: (identifier) => {
      const destination = normaliseAuthIdentifier(identifier);
      setPendingAuth({ mode: "sign-in", channel: isValidEmailInput(identifier) ? "email" : "phone", destination });
    },
    beginRegistration: async ({ name, email, phone, city, password }) => {
      const normalisedPhone = normaliseZambianPhone(phone);
      setAuthError("");
      setRegistrationErrors({});
      try {
        const challenge = await repositories.auth.register({ name, email, phone: normalisedPhone, city, password });
        await Promise.all([
          challenge.sessionToken ? setSessionToken(challenge.sessionToken) : Promise.resolve(),
          challenge.csrfToken ? setSessionCsrfToken(challenge.csrfToken) : Promise.resolve(),
        ]);
        setAuthChallenge(challenge);
        setPendingAuth({
          mode: "register",
          channel: "phone",
          destination: normalisedPhone,
          profile: {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: normalisedPhone,
            city: city.trim() || "Lusaka",
          },
        });
        return true;
      } catch (error) {
        if (error instanceof MobileApiError && error.code === "VALIDATION_FAILED") {
          const fields = error.options.fieldErrors;
          const first = (field: string) => fields?.[field]?.[0];
          const nextErrors: RegistrationErrors = {
            ...(first("firstName") || first("lastName") ? { name: first("firstName") ?? first("lastName") } : {}),
            ...(first("email") ? { email: first("email") } : {}),
            ...(first("phone") ? { phone: first("phone") } : {}),
            ...(first("city") ? { city: first("city") } : {}),
            ...(first("password") ? { password: first("password") } : {}),
          };
          setRegistrationErrors(nextErrors);
          const firstMessage = Object.values(nextErrors).find(Boolean);
          setAuthError(firstMessage ?? "Check your account details and try again.");
          if (__DEV__ && fields) console.warn("[NWC AUTH] Registration fields rejected:", Object.keys(fields).join(", "));
          return false;
        }
        setAuthError(error instanceof Error ? error.message : "We could not create your account. Please try again.");
        return false;
      }
    },
    clearRegistrationError: (field) => {
      setRegistrationErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
    },
    completeCredentialSignIn: async (identifier, password, remember = true) => {
      await clearLocalCustomerState();
      setCustomer(null);
      setAuthError("");
      try {
        const session = await repositories.auth.signIn({ identifier, password, remember });
        if (!session.customer.portalEnabled) {
          setAuthError("This account is not enabled for the customer portal.");
          return false;
        }
        const nextCustomer = await persistAuthSession(session);
        setCustomer(nextCustomer);
        setAuthError("");
        return true;
      } catch (error) {
        if (error instanceof MobileApiError && error.code === "CONTACT_UNVERIFIED") {
          setAuthError("This account still needs verification. Please use the verification link or contact support to resend the code.");
          return false;
        }
        if (error instanceof MobileApiError && error.code === "FORBIDDEN") {
          setAuthError("This account is not enabled for the customer portal yet.");
          return false;
        }
        if (error instanceof MobileApiError && error.code === "UNAUTHENTICATED") {
          setAuthError("Incorrect email, phone, or password.");
          return false;
        }
        setAuthError(error instanceof Error ? error.message : "We could not sign you in. Please try again.");
        return false;
      }
    },
    completeGoogleSignIn: async () => {
      setAuthError(featureFlags.useLaravelAuth
        ? "Google sign-in is not connected for the live customer portal yet. Please sign in with email or phone."
        : "Google sign-in is unavailable in this build. Please sign in with email or phone.");
      return false;
    },
    clearPendingAuth: () => { setPendingAuth(null); setAuthChallenge(null); setAuthError(""); },
    completeVerification: async (code = "") => {
      if (!pendingAuth || !authChallenge) {
        setAuthError("This verification request has expired. Please request a new code.");
        return false;
      }
      setAuthError("");
      try {
        const session = await repositories.auth.verifyOtp({ challengeId: authChallenge.id, code });
        if (!session.customer.portalEnabled) {
          setAuthError("This account is not enabled for the customer portal.");
          return false;
        }
        const nextCustomer = await persistAuthSession(session);
        setCustomer(nextCustomer);
        setPendingAuth(null);
        setAuthChallenge(null);
        return true;
      } catch (error) {
        setAuthError(error instanceof Error ? error.message : "We could not verify that code. Please try again.");
        return false;
      }
    },
    requestPasswordReset: async (identifier) => {
      setAuthError("");
      try {
        const challenge = await repositories.auth.requestPasswordReset({ identifier });
        setAuthChallenge(challenge);
        setPendingAuth({ mode: "sign-in", channel: challenge.channel, destination: challenge.destination });
        return true;
      } catch (error) {
        setAuthError(error instanceof Error ? error.message : "We could not start password recovery. Please try again.");
        return false;
      }
    },
    resetPassword: async (code, password) => {
      if (!authChallenge) return false;
      setAuthError("");
      try {
        await repositories.auth.resetPassword({ challengeId: authChallenge.id, code, password });
        setAuthChallenge(null);
        setPendingAuth(null);
        return true;
      } catch (error) {
        setAuthError(error instanceof Error ? error.message : "We could not reset your password. Please try again.");
        return false;
      }
    },
    changePassword: async (currentPassword, newPassword) => {
      setAuthError("");
      try {
        await repositories.auth.changePassword({ currentPassword, newPassword });
        return true;
      } catch (error) {
        setAuthError(error instanceof Error ? error.message : "We could not update your password. Please try again.");
        return false;
      }
    },
    resendVerification: async () => {
      if (!authChallenge) return false;
      setAuthError("");
      try {
        const challenge = await repositories.auth.resendOtp(authChallenge.id);
        setAuthChallenge(challenge);
        return true;
      } catch (error) {
        setAuthError(error instanceof Error ? error.message : "We could not resend the code. Please try again.");
        return false;
      }
    },
    updateProfile: async ({ name, phone }) => {
      if (!customer) return;
      const profile = await repositories.customer.updateProfile({ name: name.trim(), phone: phone.trim() });
      const nextCustomer: CustomerProfile = {
        ...customer,
        name: profile.name,
        phone: profile.phone,
        city: profile.city,
        ...(profile.email ? { email: profile.email } : {}),
        ...(profile.avatarUrl ? { avatarUrl: profile.avatarUrl } : {}),
        ...(profile.branchId ? { branchId: profile.branchId } : {}),
        portalEnabled: profile.portalEnabled ?? customer.portalEnabled ?? true,
      };
      const storedSession = await readSecureSession();
      await writeSecureSession(storedSession ? { ...storedSession, customer: domainCustomerFromStored(nextCustomer) } : { customer: domainCustomerFromStored(nextCustomer) });
      setCustomer(nextCustomer);
    },
    signOut: async () => {
      try {
        await repositories.auth.signOut();
      } catch {
        // Local cleanup must still complete even when the server session is already expired.
      }
      await clearLocalCustomerState();
      setCustomer(null);
      setPendingAuth(null);
      setAuthChallenge(null);
      setAuthError("");
    },
  }), [authChallenge, authError, customer, isRestoring, pendingAuth, registrationErrors]);

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return context;
}
