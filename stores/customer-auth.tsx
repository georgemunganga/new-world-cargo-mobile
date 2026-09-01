import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";

import { isValidEmailInput, normaliseAuthIdentifier, normaliseZambianPhone } from "@/lib/auth-flow";
import { decodeStoredCustomer, type StoredCustomer } from "@/lib/customer-session";
import { clearStoredSession, readStoredSession, writeStoredSession } from "@/lib/session-storage";

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
  beginSignIn: (identifier: string) => void;
  beginRegistration: (details: RegistrationDetails) => void;
  completeCredentialSignIn: (identifier: string) => Promise<void>;
  completeGoogleSignIn: () => Promise<void>;
  clearPendingAuth: () => void;
  completeVerification: () => Promise<void>;
  updateProfile: (details: Pick<CustomerProfile, "name" | "phone">) => Promise<void>;
  signOut: () => Promise<void>;
};

const CustomerAuthContext = createContext<AuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: PropsWithChildren) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [pendingAuth, setPendingAuth] = useState<PendingAuthAttempt | null>(null);

  useEffect(() => {
    let active = true;
    void readStoredSession()
      .then((value) => {
        if (!active || !value) return;
        const saved = decodeStoredCustomer(value);
        if (saved) setCustomer(saved);
        else void clearStoredSession();
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
    beginSignIn: (identifier) => {
      const destination = normaliseAuthIdentifier(identifier);
      setPendingAuth({ mode: "sign-in", channel: isValidEmailInput(identifier) ? "email" : "phone", destination });
    },
    beginRegistration: ({ name, email, phone, city }) => {
      const normalisedPhone = normaliseZambianPhone(phone);
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
    },
    completeCredentialSignIn: async (identifier) => {
      const normalised = normaliseAuthIdentifier(identifier);
      const isEmail = isValidEmailInput(identifier);
      const nextCustomer: CustomerProfile = {
        id: `local-${Date.now()}`,
        name: "New WorldCargo customer",
        phone: isEmail ? "+260971234567" : normalised,
        ...(isEmail ? { email: normalised } : {}),
        city: "Lusaka",
      };
      await writeStoredSession(JSON.stringify(nextCustomer));
      setCustomer(nextCustomer);
    },
    completeGoogleSignIn: async () => {
      const nextCustomer: CustomerProfile = { id: `google-${Date.now()}`, name: "Google customer", phone: "+260971234567", email: "customer@gmail.com", city: "Lusaka" };
      await writeStoredSession(JSON.stringify(nextCustomer));
      setCustomer(nextCustomer);
    },
    clearPendingAuth: () => setPendingAuth(null),
    completeVerification: async () => {
      if (!pendingAuth) return;
      const nextCustomer: CustomerProfile = pendingAuth.mode === "register"
        ? { id: `local-${Date.now()}`, ...pendingAuth.profile }
        : {
            id: `local-${Date.now()}`,
            name: "New WorldCargo customer",
            phone: pendingAuth.channel === "phone" ? pendingAuth.destination : "+260971234567",
            ...(pendingAuth.channel === "email" ? { email: pendingAuth.destination } : {}),
            city: "Lusaka",
          };
      await writeStoredSession(JSON.stringify(nextCustomer));
      setCustomer(nextCustomer);
      setPendingAuth(null);
    },
    updateProfile: async ({ name, phone }) => {
      if (!customer) return;
      const nextCustomer: CustomerProfile = { ...customer, name: name.trim(), phone: phone.trim() };
      await writeStoredSession(JSON.stringify(nextCustomer));
      setCustomer(nextCustomer);
    },
    signOut: async () => {
      await clearStoredSession();
      setCustomer(null);
      setPendingAuth(null);
    },
  }), [customer, isRestoring, pendingAuth]);

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return context;
}
