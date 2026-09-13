import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { canPayWithMockWallet, getDefaultPaymentMethod, mockInvoices, mockSavedPaymentMethods, mockWalletStartingBalance, paymentMethodLabel, type MockInvoice, type MockPaymentMethod, type MockPaymentState, type MockSavedPaymentMethod, type MockWalletActivity } from "@/lib/mock-billing";
import type { CustomerInvoice } from "@/lib/domain/billing";
import { repositories } from "@/lib/repositories";
import { readCache, writeCache } from "@/lib/storage/cache-storage";
import { storageKeys } from "@/lib/storage/storage-keys";

type CustomerBillingAccountContextValue = {
  paymentState: MockPaymentState;
  invoices: MockInvoice[];
  selectedInvoiceId?: string;
  selectedInvoice?: MockInvoice;
  lastPaidInvoiceId?: string;
  selectedPaymentMethod: MockPaymentMethod;
  paymentMethods: MockSavedPaymentMethod[];
  selectedPaymentMethodId?: string;
  walletBalance: number;
  walletActivity: MockWalletActivity[];
  reminders: Record<string, boolean>;
  setPaymentState: (state: MockPaymentState) => void;
  selectInvoice: (invoiceId?: string) => void;
  setSelectedPaymentMethod: (method: MockPaymentMethod) => void;
  selectSavedPaymentMethod: (methodId: string) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  addPaymentMethod: (method: Exclude<MockPaymentMethod, "wallet">) => void;
  removePaymentMethod: (methodId: string) => void;
  confirmSelectedInvoicePayment: () => void;
  topUpWallet: (amount: number) => void;
  toggleInvoiceReminder: (invoiceId: string) => void;
  submitInvoiceDispute: (invoiceId: string) => void;
};

const CustomerBillingAccountContext = createContext<CustomerBillingAccountContextValue | null>(null);

function mockInvoiceFromCustomerInvoice(invoice: CustomerInvoice): MockInvoice {
  return {
    id: invoice.id,
    reference: invoice.reference,
    shipmentReference: invoice.shipmentCode ?? invoice.reference,
    description: invoice.description,
    shipmentLabel: invoice.shipmentLabel,
    route: invoice.route,
    amount: invoice.amount.formatted,
    amountValue: invoice.amount.amount,
    currencyDetail: invoice.currencyDetail ?? `${invoice.amount.currencyCode} · account currency`,
    issuedAt: invoice.issuedAt ?? "To confirm",
    dueAt: invoice.dueAt,
    paidAt: invoice.paidAt,
    paymentMethod: invoice.paymentMethod,
    status: invoice.status === "paid" ? "paid" : "unpaid",
    lineItems: invoice.lineItems.length
      ? invoice.lineItems.map((item) => ({ label: item.label, ...(item.detail ? { detail: item.detail } : {}), amount: item.amount.formatted }))
      : [{ label: "Cargo charge", amount: invoice.amount.formatted }],
    ...(invoice.resolution ? { resolution: invoice.resolution } : {}),
  };
}

export function CustomerBillingAccountProvider({ children }: PropsWithChildren) {
  const [paymentState, setPaymentState] = useState<MockPaymentState>("ready");
  const [invoices, setInvoices] = useState<MockInvoice[]>(mockInvoices);
  const [selectedInvoiceId, selectInvoice] = useState<string | undefined>(mockInvoices.find((invoice) => invoice.status === "unpaid")?.id);
  const [lastPaidInvoiceId, setLastPaidInvoiceId] = useState<string | undefined>();
  const [paymentMethods, setPaymentMethods] = useState<MockSavedPaymentMethod[]>(mockSavedPaymentMethods);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | undefined>(getDefaultPaymentMethod(mockSavedPaymentMethods)?.id);
  const [walletBalance, setWalletBalance] = useState(mockWalletStartingBalance);
  const [walletActivity, setWalletActivity] = useState<MockWalletActivity[]>([{ id: "wallet-opening", label: "Wallet balance", detail: "Opening mock balance", amount: mockWalletStartingBalance, type: "topup", time: "1 Sep" }]);
  const [reminders, setReminders] = useState<Record<string, boolean>>(() => Object.fromEntries(mockInvoices.filter((invoice) => invoice.status === "unpaid").map((invoice) => [invoice.id, true])));

  useEffect(() => {
    let active = true;
    void repositories.billing.listInvoices().then((records) => {
      if (!active || !records.length) return;
      void writeCache(storageKeys.billingCache, records);
      const nextInvoices = records.map(mockInvoiceFromCustomerInvoice);
      setInvoices(nextInvoices);
      selectInvoice((current) => current && nextInvoices.some((invoice) => invoice.id === current) ? current : nextInvoices.find((invoice) => invoice.status === "unpaid")?.id ?? nextInvoices[0]?.id);
      setReminders((current) => {
        const next = { ...current };
        for (const invoice of nextInvoices) {
          if (invoice.status === "unpaid" && typeof next[invoice.id] !== "boolean") next[invoice.id] = true;
        }
        return next;
      });
    }).catch(async () => {
      const cached = await readCache<CustomerInvoice[]>(storageKeys.billingCache);
      if (!active || !cached?.value.length) return;
      const nextInvoices = cached.value.map(mockInvoiceFromCustomerInvoice);
      setInvoices(nextInvoices);
      selectInvoice((current) => current && nextInvoices.some((invoice) => invoice.id === current) ? current : nextInvoices.find((invoice) => invoice.status === "unpaid")?.id ?? nextInvoices[0]?.id);
    });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;
    void Promise.all([
      repositories.billingActions.listPaymentMethods(),
      repositories.billingActions.getWallet(),
    ]).then(([methods, wallet]) => {
      if (!active) return;
      if (methods.length) {
        setPaymentMethods(methods);
        setSelectedPaymentMethodId((current) => current && methods.some((method) => method.id === current) ? current : getDefaultPaymentMethod(methods)?.id);
      }
      setWalletBalance(wallet.balance);
      setWalletActivity(wallet.activity);
    }).catch(() => {
      // Keep local deterministic payment methods and wallet when live money actions are not connected.
    });
    return () => {
      active = false;
    };
  }, []);

  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId);
  const selectedSavedPaymentMethod = paymentMethods.find((item) => item.id === selectedPaymentMethodId) ?? getDefaultPaymentMethod(paymentMethods);
  const selectedPaymentMethod = selectedSavedPaymentMethod?.method ?? "mobile";
  const setSelectedPaymentMethod = (method: MockPaymentMethod) => setSelectedPaymentMethodId(paymentMethods.find((item) => item.method === method)?.id);
  const selectSavedPaymentMethod = (methodId: string) => setSelectedPaymentMethodId(methodId);
  const setDefaultPaymentMethod = (methodId: string) => {
    setPaymentMethods((current) => current.map((item) => ({ ...item, isDefault: item.id === methodId })));
    void repositories.billingActions.setDefaultPaymentMethod(methodId).then(setPaymentMethods).catch(() => undefined);
  };
  const addPaymentMethod = (method: Exclude<MockPaymentMethod, "wallet">) => {
    void repositories.billingActions.savePaymentMethod(method).then((saved) => setPaymentMethods((current) => current.some((item) => item.id === saved.id) ? current : [...current, saved])).catch(() => {
      setPaymentMethods((current) => [...current, { id: `${method}-${current.length + 1}`, method, label: method === "mobile" ? "Mobile money" : "Bank card", detail: method === "mobile" ? "Airtel · 097 555 0124" : "Visa ·•••• 6620" }]);
    });
  };
  const removePaymentMethod = (methodId: string) => {
    setPaymentMethods((current) => { const next = current.filter((item) => item.id !== methodId); const selectedRemoved = methodId === selectedPaymentMethodId; if (selectedRemoved) setSelectedPaymentMethodId(getDefaultPaymentMethod(next)?.id); return next.some((item) => item.isDefault) ? next : next.map((item, index) => ({ ...item, isDefault: index === 0 })); });
    void repositories.billingActions.removePaymentMethod(methodId).catch(() => undefined);
  };
  const confirmSelectedInvoicePayment = () => {
    if (!selectedInvoiceId || !selectedInvoice) return;
    if (selectedPaymentMethod === "wallet" && !canPayWithMockWallet(walletBalance, selectedInvoice)) { setPaymentState("failed"); return; }
    void repositories.billingActions.confirmInvoicePayment({ invoice: { id: selectedInvoice.id, reference: selectedInvoice.reference, amount: { amount: selectedInvoice.amountValue, currencyCode: "ZMW", formatted: selectedInvoice.amount } }, method: selectedPaymentMethod, walletBalance }).then((result) => {
      if (result.state !== "confirmed") { setPaymentState(result.state); return; }
      setInvoices((current) => current.map((invoice) => invoice.id === selectedInvoiceId ? { ...invoice, status: "paid", dueAt: undefined, paidAt: result.paidAt ?? "Just now", paymentMethod: result.paymentMethodLabel ?? paymentMethodLabel(selectedPaymentMethod) } : invoice));
      if (typeof result.walletBalance === "number") setWalletBalance(result.walletBalance);
      if (result.walletActivity) setWalletActivity((current) => [result.walletActivity!, ...current.filter((item) => item.id !== result.walletActivity!.id)]);
      setLastPaidInvoiceId(selectedInvoiceId);
      setPaymentState("confirmed");
    }).catch(() => setPaymentState("failed"));
  };
  const topUpWallet = (amount: number) => {
    void repositories.billingActions.topUpWallet(amount).then((wallet) => { setWalletBalance(wallet.balance); setWalletActivity(wallet.activity); }).catch(() => {
      setWalletBalance((balance) => balance + amount);
      setWalletActivity((current) => [{ id: `wallet-topup-${Date.now()}`, label: "Wallet top-up", detail: "Mock top-up confirmed", amount, type: "topup", time: "Just now" }, ...current]);
    });
  };
  const toggleInvoiceReminder = (invoiceId: string) => setReminders((current) => { const enabled = !current[invoiceId]; void repositories.billingActions.setInvoiceReminder(invoiceId, enabled).catch(() => undefined); return { ...current, [invoiceId]: enabled }; });
  const submitInvoiceDispute = (invoiceId: string) => { void repositories.billingActions.disputeInvoice(invoiceId).then((resolution) => setInvoices((current) => current.map((invoice) => invoice.id === invoiceId ? { ...invoice, ...(resolution ? { resolution } : {}) } : invoice))).catch(() => undefined); };
  const value = useMemo<CustomerBillingAccountContextValue>(() => ({ paymentState, invoices, selectedInvoiceId, selectedInvoice, lastPaidInvoiceId, selectedPaymentMethod, paymentMethods, selectedPaymentMethodId, walletBalance, walletActivity, reminders, setPaymentState, selectInvoice, setSelectedPaymentMethod, selectSavedPaymentMethod, setDefaultPaymentMethod, addPaymentMethod, removePaymentMethod, confirmSelectedInvoicePayment, topUpWallet, toggleInvoiceReminder, submitInvoiceDispute }), [invoices, lastPaidInvoiceId, paymentMethods, paymentState, reminders, selectedInvoice, selectedInvoiceId, selectedPaymentMethod, selectedPaymentMethodId, walletActivity, walletBalance]);
  return <CustomerBillingAccountContext.Provider value={value}>{children}</CustomerBillingAccountContext.Provider>;
}

export function useCustomerBillingAccount() {
  const context = useContext(CustomerBillingAccountContext);
  if (!context) throw new Error("useCustomerBillingAccount must be used within CustomerBillingAccountProvider");
  return context;
}
