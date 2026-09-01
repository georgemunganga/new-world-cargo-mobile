import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import { canPayWithMockWallet, mockInvoices, mockWalletStartingBalance, paymentMethodLabel, type MockInvoice, type MockInvoiceResolution, type MockPaymentMethod, type MockPaymentState, type MockWalletActivity } from "@/lib/mock-billing";

type MockBillingContextValue = {
  paymentState: MockPaymentState;
  invoices: MockInvoice[];
  selectedInvoiceId?: string;
  selectedInvoice?: MockInvoice;
  lastPaidInvoiceId?: string;
  selectedPaymentMethod: MockPaymentMethod;
  walletBalance: number;
  walletActivity: MockWalletActivity[];
  reminders: Record<string, boolean>;
  setPaymentState: (state: MockPaymentState) => void;
  selectInvoice: (invoiceId?: string) => void;
  setSelectedPaymentMethod: (method: MockPaymentMethod) => void;
  confirmSelectedInvoicePayment: () => void;
  topUpWallet: (amount: number) => void;
  toggleInvoiceReminder: (invoiceId: string) => void;
  submitInvoiceDispute: (invoiceId: string) => void;
};

const MockBillingContext = createContext<MockBillingContextValue | null>(null);

export function MockBillingProvider({ children }: PropsWithChildren) {
  const [paymentState, setPaymentState] = useState<MockPaymentState>("ready");
  const [invoices, setInvoices] = useState<MockInvoice[]>(mockInvoices);
  const [selectedInvoiceId, selectInvoice] = useState<string | undefined>(mockInvoices.find((invoice) => invoice.status === "unpaid")?.id);
  const [lastPaidInvoiceId, setLastPaidInvoiceId] = useState<string | undefined>();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<MockPaymentMethod>("mobile");
  const [walletBalance, setWalletBalance] = useState(mockWalletStartingBalance);
  const [walletActivity, setWalletActivity] = useState<MockWalletActivity[]>([{ id: "wallet-opening", label: "Wallet balance", detail: "Opening mock balance", amount: mockWalletStartingBalance, type: "topup", time: "1 Sep" }]);
  const [reminders, setReminders] = useState<Record<string, boolean>>(() => Object.fromEntries(mockInvoices.filter((invoice) => invoice.status === "unpaid").map((invoice) => [invoice.id, true])));
  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId);
  const confirmSelectedInvoicePayment = () => {
    if (!selectedInvoiceId || !selectedInvoice) return;
    if (selectedPaymentMethod === "wallet" && !canPayWithMockWallet(walletBalance, selectedInvoice)) { setPaymentState("failed"); return; }
    setInvoices((current) => current.map((invoice) => invoice.id === selectedInvoiceId ? { ...invoice, status: "paid", dueAt: undefined, paidAt: "Just now", paymentMethod: paymentMethodLabel(selectedPaymentMethod) } : invoice));
    if (selectedPaymentMethod === "wallet") { setWalletBalance((balance) => balance - selectedInvoice.amountValue); setWalletActivity((current) => [{ id: `wallet-payment-${selectedInvoiceId}`, label: `Paid ${selectedInvoice.reference}`, detail: "Invoice payment", amount: -selectedInvoice.amountValue, type: "payment", time: "Just now" }, ...current]); }
    setLastPaidInvoiceId(selectedInvoiceId);
    setPaymentState("confirmed");
  };
  const topUpWallet = (amount: number) => { setWalletBalance((balance) => balance + amount); setWalletActivity((current) => [{ id: `wallet-topup-${Date.now()}`, label: "Wallet top-up", detail: "Mock top-up confirmed", amount, type: "topup", time: "Just now" }, ...current]); };
  const toggleInvoiceReminder = (invoiceId: string) => setReminders((current) => ({ ...current, [invoiceId]: !current[invoiceId] }));
  const submitInvoiceDispute = (invoiceId: string) => { const resolution: MockInvoiceResolution = { kind: "dispute", title: "Charge review started", detail: "A mock support case is open. We will keep your invoice visible while the charge is reviewed.", events: [{ label: "Review requested", detail: "Your question was sent to New WorldCargo support.", time: "Just now", complete: true }, { label: "Charge review", detail: "A specialist will review the shipment and charges.", time: "Next update pending", complete: false }] }; setInvoices((current) => current.map((invoice) => invoice.id === invoiceId ? { ...invoice, resolution } : invoice)); };
  const value = useMemo<MockBillingContextValue>(() => ({ paymentState, invoices, selectedInvoiceId, selectedInvoice, lastPaidInvoiceId, selectedPaymentMethod, walletBalance, walletActivity, reminders, setPaymentState, selectInvoice, setSelectedPaymentMethod, confirmSelectedInvoicePayment, topUpWallet, toggleInvoiceReminder, submitInvoiceDispute }), [invoices, lastPaidInvoiceId, paymentState, reminders, selectedInvoice, selectedInvoiceId, selectedPaymentMethod, walletActivity, walletBalance]);
  return <MockBillingContext.Provider value={value}>{children}</MockBillingContext.Provider>;
}

export function useMockBilling() {
  const context = useContext(MockBillingContext);
  if (!context) throw new Error("useMockBilling must be used within MockBillingProvider");
  return context;
}
