import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { getDefaultPaymentMethod, mockInvoices, mockSavedPaymentMethods, mockWalletStartingBalance, type MockInvoice, type MockPaymentMethod, type MockPaymentState, type MockSavedPaymentMethod, type MockWalletActivity } from "@/lib/mock-billing";
import { canPayWithDisplayWallet, displayInvoiceFromCustomerInvoice, paymentMethodLabel, type CustomerInvoice } from "@/lib/domain/billing";
import { featureFlags } from "@/lib/config/feature-flags";
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
  actionError: string;
  clearActionError: () => void;
  setPaymentState: (state: MockPaymentState) => void;
  selectInvoice: (invoiceId?: string) => void;
  setSelectedPaymentMethod: (method: MockPaymentMethod) => void;
  selectSavedPaymentMethod: (methodId: string) => void;
  setDefaultPaymentMethod: (methodId: string) => void;
  addPaymentMethod: (method: Exclude<MockPaymentMethod, "wallet">) => void;
  removePaymentMethod: (methodId: string) => void;
  confirmSelectedInvoicePayment: () => void;
  topUpWallet: (amount: number) => Promise<boolean>;
  toggleInvoiceReminder: (invoiceId: string) => void;
  submitInvoiceDispute: (invoiceId: string) => void;
};

const CustomerBillingAccountContext = createContext<CustomerBillingAccountContextValue | null>(null);

export function CustomerBillingAccountProvider({ children }: PropsWithChildren) {
  const useLiveBilling = featureFlags.useLaravelBilling;
  const useLiveBillingActions = featureFlags.useLaravelBillingActions;
  const seededInvoices = useLiveBilling ? [] : mockInvoices;
  const seededPaymentMethods = useLiveBillingActions ? [] : mockSavedPaymentMethods;
  const [paymentState, setPaymentState] = useState<MockPaymentState>("ready");
  const [invoices, setInvoices] = useState<MockInvoice[]>(seededInvoices);
  const [selectedInvoiceId, selectInvoice] = useState<string | undefined>(seededInvoices.find((invoice) => invoice.status === "unpaid")?.id);
  const [lastPaidInvoiceId, setLastPaidInvoiceId] = useState<string | undefined>();
  const [paymentMethods, setPaymentMethods] = useState<MockSavedPaymentMethod[]>(seededPaymentMethods);
  const [selectedPaymentMethodId, setSelectedPaymentMethodId] = useState<string | undefined>(getDefaultPaymentMethod(seededPaymentMethods)?.id);
  const [walletBalance, setWalletBalance] = useState(useLiveBillingActions ? 0 : mockWalletStartingBalance);
  const [walletActivity, setWalletActivity] = useState<MockWalletActivity[]>(useLiveBillingActions ? [] : [{ id: "wallet-opening", label: "Wallet balance", detail: "Opening balance", amount: mockWalletStartingBalance, type: "topup", time: "1 Sep" }]);
  const [reminders, setReminders] = useState<Record<string, boolean>>(() => Object.fromEntries(seededInvoices.filter((invoice) => invoice.status === "unpaid").map((invoice) => [invoice.id, true])));
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    let active = true;
    void repositories.billing.listInvoices().then((records) => {
      if (!active) return;
      void writeCache(storageKeys.billingCache, records);
      const nextInvoices = records.map(displayInvoiceFromCustomerInvoice);
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
      const nextInvoices = cached.value.map(displayInvoiceFromCustomerInvoice);
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
      if (useLiveBillingActions) {
        setPaymentMethods([]);
        setSelectedPaymentMethodId(undefined);
        setWalletBalance(0);
        setWalletActivity([]);
      }
    });
    return () => {
      active = false;
    };
  }, [useLiveBillingActions]);

  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId);
  const selectedSavedPaymentMethod = paymentMethods.find((item) => item.id === selectedPaymentMethodId) ?? getDefaultPaymentMethod(paymentMethods);
  const selectedPaymentMethod = selectedSavedPaymentMethod?.method ?? "mobile";
  const setSelectedPaymentMethod = (method: MockPaymentMethod) => setSelectedPaymentMethodId(paymentMethods.find((item) => item.method === method)?.id);
  const selectSavedPaymentMethod = (methodId: string) => setSelectedPaymentMethodId(methodId);
  const setDefaultPaymentMethod = (methodId: string) => {
    setActionError("");
    void repositories.billingActions.setDefaultPaymentMethod(methodId).then(setPaymentMethods).catch(() => setActionError("We could not change the default payment method. Please try again."));
  };
  const addPaymentMethod = (method: Exclude<MockPaymentMethod, "wallet">) => {
    setActionError("");
    void repositories.billingActions.savePaymentMethod(method).then((saved) => setPaymentMethods((current) => current.some((item) => item.id === saved.id) ? current : [...current, saved])).catch(() => {
      if (useLiveBillingActions) { setActionError("We could not save that payment method. Please try again."); return; }
      setPaymentMethods((current) => [...current, { id: `${method}-${current.length + 1}`, method, label: method === "mobile" ? "Mobile money" : "Bank card", detail: method === "mobile" ? "Airtel · 097 555 0124" : "Visa ·•••• 6620" }]);
    });
  };
  const removePaymentMethod = (methodId: string) => {
    setActionError("");
    void repositories.billingActions.removePaymentMethod(methodId).then(() => {
      setPaymentMethods((current) => { const next = current.filter((item) => item.id !== methodId); const selectedRemoved = methodId === selectedPaymentMethodId; if (selectedRemoved) setSelectedPaymentMethodId(getDefaultPaymentMethod(next)?.id); return next.some((item) => item.isDefault) ? next : next.map((item, index) => ({ ...item, isDefault: index === 0 })); });
    }).catch(() => setActionError("We could not remove that payment method. Please try again."));
  };
  const confirmSelectedInvoicePayment = () => {
    if (!selectedInvoiceId || !selectedInvoice) return;
    if (selectedPaymentMethod === "wallet" && !canPayWithDisplayWallet(walletBalance, selectedInvoice)) { setPaymentState("failed"); return; }
    void repositories.billingActions.confirmInvoicePayment({ invoice: { id: selectedInvoice.id, reference: selectedInvoice.reference, amount: { amount: selectedInvoice.amountValue, currencyCode: "ZMW", formatted: selectedInvoice.amount } }, method: selectedPaymentMethod, walletBalance }).then((result) => {
      if (result.state !== "confirmed") { setPaymentState(result.state); return; }
      setInvoices((current) => current.map((invoice) => invoice.id === selectedInvoiceId ? { ...invoice, status: "paid", dueAt: undefined, paidAt: result.paidAt ?? "Just now", paymentMethod: result.paymentMethodLabel ?? paymentMethodLabel(selectedPaymentMethod) } : invoice));
      if (typeof result.walletBalance === "number") setWalletBalance(result.walletBalance);
      if (result.walletActivity) setWalletActivity((current) => [result.walletActivity!, ...current.filter((item) => item.id !== result.walletActivity!.id)]);
      setLastPaidInvoiceId(selectedInvoiceId);
      setPaymentState("confirmed");
    }).catch(() => { setPaymentState("failed"); setActionError("Payment could not be confirmed. No successful payment was recorded."); });
  };
  const topUpWallet = async (amount: number) => {
    try {
      const wallet = await repositories.billingActions.topUpWallet(amount);
      setWalletBalance(wallet.balance);
      setWalletActivity(wallet.activity);
      return true;
    } catch {
      if (useLiveBillingActions) {
        setPaymentState("failed");
        return false;
      }
      setWalletBalance((balance) => balance + amount);
      setWalletActivity((current) => [{ id: `wallet-topup-${Date.now()}`, label: "Wallet top-up", detail: "Top-up confirmed", amount, type: "topup", time: "Just now" }, ...current]);
      return true;
    }
  };
  const toggleInvoiceReminder = (invoiceId: string) => {
    const enabled = !reminders[invoiceId];
    setActionError("");
    void repositories.billingActions.setInvoiceReminder(invoiceId, enabled)
      .then(() => setReminders((current) => ({ ...current, [invoiceId]: enabled })))
      .catch(() => setActionError("We could not update this reminder. Please try again."));
  };
  const submitInvoiceDispute = (invoiceId: string) => {
    setActionError("");
    void repositories.billingActions.disputeInvoice(invoiceId)
      .then((resolution) => setInvoices((current) => current.map((invoice) => invoice.id === invoiceId ? { ...invoice, ...(resolution ? { resolution } : {}) } : invoice)))
      .catch(() => setActionError("We could not submit the invoice dispute. Please try again."));
  };
  const value = useMemo<CustomerBillingAccountContextValue>(() => ({ paymentState, invoices, selectedInvoiceId, selectedInvoice, lastPaidInvoiceId, selectedPaymentMethod, paymentMethods, selectedPaymentMethodId, walletBalance, walletActivity, reminders, actionError, clearActionError: () => setActionError(""), setPaymentState, selectInvoice, setSelectedPaymentMethod, selectSavedPaymentMethod, setDefaultPaymentMethod, addPaymentMethod, removePaymentMethod, confirmSelectedInvoicePayment, topUpWallet, toggleInvoiceReminder, submitInvoiceDispute }), [actionError, invoices, lastPaidInvoiceId, paymentMethods, paymentState, reminders, selectedInvoice, selectedInvoiceId, selectedPaymentMethod, selectedPaymentMethodId, walletActivity, walletBalance]);
  return <CustomerBillingAccountContext.Provider value={value}>{children}</CustomerBillingAccountContext.Provider>;
}

export function useCustomerBillingAccount() {
  const context = useContext(CustomerBillingAccountContext);
  if (!context) throw new Error("useCustomerBillingAccount must be used within CustomerBillingAccountProvider");
  return context;
}
