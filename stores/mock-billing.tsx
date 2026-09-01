import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import { mockInvoices, paymentMethodLabel, type MockInvoice, type MockPaymentMethod, type MockPaymentState } from "@/lib/mock-billing";

type MockBillingContextValue = {
  paymentState: MockPaymentState;
  invoices: MockInvoice[];
  selectedInvoiceId?: string;
  selectedInvoice?: MockInvoice;
  lastPaidInvoiceId?: string;
  selectedPaymentMethod: MockPaymentMethod;
  setPaymentState: (state: MockPaymentState) => void;
  selectInvoice: (invoiceId?: string) => void;
  setSelectedPaymentMethod: (method: MockPaymentMethod) => void;
  confirmSelectedInvoicePayment: () => void;
};

const MockBillingContext = createContext<MockBillingContextValue | null>(null);

export function MockBillingProvider({ children }: PropsWithChildren) {
  const [paymentState, setPaymentState] = useState<MockPaymentState>("ready");
  const [invoices, setInvoices] = useState<MockInvoice[]>(mockInvoices);
  const [selectedInvoiceId, selectInvoice] = useState<string | undefined>(mockInvoices.find((invoice) => invoice.status === "unpaid")?.id);
  const [lastPaidInvoiceId, setLastPaidInvoiceId] = useState<string | undefined>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<MockPaymentMethod>("mobile");
  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId);
  const confirmSelectedInvoicePayment = () => {
    if (!selectedInvoiceId) return;
    setInvoices((current) => current.map((invoice) => invoice.id === selectedInvoiceId ? { ...invoice, status: "paid", dueAt: undefined, paidAt: "Just now", paymentMethod: paymentMethodLabel(selectedPaymentMethod) } : invoice));
    setLastPaidInvoiceId(selectedInvoiceId);
    setPaymentState("confirmed");
  };
  const value = useMemo<MockBillingContextValue>(() => ({ paymentState, invoices, selectedInvoiceId, selectedInvoice, lastPaidInvoiceId, selectedPaymentMethod, setPaymentState, selectInvoice, setSelectedPaymentMethod, confirmSelectedInvoicePayment }), [invoices, lastPaidInvoiceId, paymentState, selectedInvoice, selectedInvoiceId, selectedPaymentMethod]);
  return <MockBillingContext.Provider value={value}>{children}</MockBillingContext.Provider>;
}

export function useMockBilling() {
  const context = useContext(MockBillingContext);
  if (!context) throw new Error("useMockBilling must be used within MockBillingProvider");
  return context;
}
