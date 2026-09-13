import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { isValidEmailInput, normaliseAuthIdentifier, normaliseZambianPhone } from "@/lib/auth-flow";
import { decodeStoredCustomer, type StoredCustomer } from "@/lib/customer-session";
import type { AuthSession, OtpChallenge } from "@/lib/domain/auth";
import type { CustomerProfile as DomainCustomerProfile } from "@/lib/domain/customer";
import { removeSessionToken, setSessionToken } from "@/lib/_core/auth";
import { repositories } from "@/lib/repositories";
import { clearStoredSession, readStoredSession } from "@/lib/session-storage";
import { clearSecureSession, readSecureSession, writeSecureSession } from "@/lib/storage/secure-session-storage";

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

type AuthContextValue = {
  customer: CustomerProfile | null;
  isRestoring: boolean;
  pendingAuth: PendingAuthAttempt | null;
  authChallenge: OtpChallenge | null;
  authError: string;
  beginSignIn: (identifier: string) => void;
  beginRegistration: (details: RegistrationDetails & { password: string }) => Promise<boolean>;
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
    ...(customer.branchId ? { branchId: customer.branchId } : {}),
    portalEnabled: customer.portalEnabled ?? true,
  };
}

async function persistAuthSession(session: AuthSession) {
  const nextCustomer = customerFromSession(session);
  await Promise.all([
    writeSecureSession(session),
    session.token ? setSessionToken(session.token) : Promise.resolve(),
  ]);
  return nextCustomer;
}

export function CustomerAuthProvider({ children }: PropsWithChildren) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [pendingAuth, setPendingAuth] = useState<PendingAuthAttempt | null>(null);
  const [authChallenge, setAuthChallenge] = useState<OtpChallenge | null>(null);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let active = true;
    void Promise.all([readStoredSession(), readSecureSession()])
      .then(async ([storedCustomerValue, storedSession]) => {
        if (!active) return;
        if (storedSession?.customer) {
          const savedSessionCustomer = customerFromSession(storedSession);
          setCustomer(savedSessionCustomer);
          if (storedSession.token) await setSessionToken(storedSession.token);
          return;
        }
        const saved = decodeStoredCustomer(storedCustomerValue);
        if (saved) {
          setCustomer(saved);
          return;
        }
        await Promise.all([clearStoredSession(), clearSecureSession(), removeSessionToken()]);
      })
      .finally(() => {
        if (active) setIsRestoring(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    customer,
    isRestoring,
    pendingAuth,
    authChallenge,
    authError,
    beginSignIn: (identifier) => {
      const destination = normaliseAuthIdentifier(identifier);
      setPendingAuth({ mode: "sign-in", channel: isValidEmailInput(identifier) ? "email" : "phone", destination });
    },
    beginRegistration: async ({ name, email, phone, city, password }) => {
      const normalisedPhone = normaliseZambianPhone(phone);
      setAuthError("");
      try {
        const challenge = await repositories.auth.register({ name, email, phone: normalisedPhone, city, password });
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
        setAuthError(error instanceof Error ? error.message : "We could not create your account. Please try again.");
        return false;
      }
    },
    completeCredentialSignIn: async (identifier, password, remember = true) => {
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
        setAuthError(error instanceof Error ? error.message : "We could not sign you in. Please try again.");
        return false;
      }
    },
    completeGoogleSignIn: async () => {
      const nextCustomer: CustomerProfile = { id: `google-${Date.now()}`, name: "Google customer", phone: "+260971234567", email: "customer@gmail.com", city: "Lusaka", portalEnabled: true };
      await writeSecureSession({ customer: domainCustomerFromStored(nextCustomer) });
      setCustomer(nextCustomer);
      return true;
    },
    clearPendingAuth: () => { setPendingAuth(null); setAuthChallenge(null); setAuthError(""); },
    completeVerification: async (code = "123456") => {
      if (!pendingAuth) return false;
      setAuthError("");
      try {
        const session = authChallenge
          ? await repositories.auth.verifyOtp({ challengeId: authChallenge.id, code })
          : await repositories.auth.signIn({ identifier: pendingAuth.destination, password: "verified-by-otp" });
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
      await Promise.all([clearStoredSession(), clearSecureSession(), removeSessionToken()]);
      setCustomer(null);
      setPendingAuth(null);
      setAuthChallenge(null);
      setAuthError("");
    },
  }), [authChallenge, authError, customer, isRestoring, pendingAuth]);

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return context;
}
