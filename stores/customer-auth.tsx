import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { normaliseZambianPhone } from "@/lib/auth-flow";
import { decodeStoredCustomer, type StoredCustomer } from "@/lib/customer-session";
import { clearStoredSession, readStoredSession, writeStoredSession } from "@/lib/session-storage";

export type CustomerProfile = StoredCustomer;

type AuthContextValue = {
  customer: CustomerProfile | null;
  isRestoring: boolean;
  pendingPhone: string;
  beginPhoneVerification: (phone: string) => void;
  clearPendingPhone: () => void;
  completeProfile: (details: Pick<CustomerProfile, "name" | "city">) => Promise<void>;
  signOut: () => Promise<void>;
};

const CustomerAuthContext = createContext<AuthContextValue | null>(null);

export function CustomerAuthProvider({ children }: PropsWithChildren) {
  const [customer, setCustomer] = useState<CustomerProfile | null>(null);
  const [isRestoring, setIsRestoring] = useState(true);
  const [pendingPhone, setPendingPhone] = useState("");

  useEffect(() => {
    let active = true;
    void readStoredSession().then((value) => {
      if (!active || !value) return;
      const saved = decodeStoredCustomer(value);
      if (saved) setCustomer(saved);
      else if (value) void clearStoredSession();
    }).finally(() => { if (active) setIsRestoring(false); });
    return () => { active = false; };
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    customer,
    isRestoring,
    pendingPhone,
    beginPhoneVerification: (phone) => setPendingPhone(normaliseZambianPhone(phone)),
    clearPendingPhone: () => setPendingPhone(""),
    completeProfile: async ({ name, city }) => {
      const nextCustomer: CustomerProfile = { id: `local-${Date.now()}`, name: name.trim(), phone: pendingPhone, city: city.trim() || "Lusaka" };
      await writeStoredSession(JSON.stringify(nextCustomer));
      setCustomer(nextCustomer);
      setPendingPhone("");
    },
    signOut: async () => {
      await clearStoredSession();
      setCustomer(null);
      setPendingPhone("");
    },
  }), [customer, isRestoring, pendingPhone]);

  return <CustomerAuthContext.Provider value={value}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerAuth() {
  const context = useContext(CustomerAuthContext);
  if (!context) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return context;
}
