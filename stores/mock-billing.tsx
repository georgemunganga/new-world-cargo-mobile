import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import type { MockPaymentState } from "@/lib/mock-billing";

type MockBillingContextValue = {
  paymentState: MockPaymentState;
  setPaymentState: (state: MockPaymentState) => void;
};

const MockBillingContext = createContext<MockBillingContextValue | null>(null);

export function MockBillingProvider({ children }: PropsWithChildren) {
  const [paymentState, setPaymentState] = useState<MockPaymentState>("ready");
  const value = useMemo(() => ({ paymentState, setPaymentState }), [paymentState]);
  return <MockBillingContext.Provider value={value}>{children}</MockBillingContext.Provider>;
}

export function useMockBilling() {
  const context = useContext(MockBillingContext);
  if (!context) throw new Error("useMockBilling must be used within MockBillingProvider");
  return context;
}
