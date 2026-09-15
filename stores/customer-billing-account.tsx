import { useQueryClient } from "@tanstack/react-query";
import { customerQueries } from "@/lib/data/customer-queries";
import { useCustomerQuery } from "@/lib/data/use-customer-query";
import { createContext, useContext, useEffect, useState, type PropsWithChildren } from "react";
import { getDefaultPaymentMethod, mockInvoices, mockSavedPaymentMethods, mockWalletStartingBalance, type MockInvoice, type MockPaymentMethod, type MockPaymentState, type MockSavedPaymentMethod, type MockWalletActivity } from "@/lib/mock-billing";
import { canPayWithDisplayWallet, displayInvoiceFromCustomerInvoice, paymentMethodLabel } from "@/lib/domain/billing";
import { featureFlags } from "@/lib/config/feature-flags";
import { repositories } from "@/lib/repositories";




type CustomerBillingAccountContextValue = {
  walletLoading: boolean;
  walletError: string;
  refreshWallet: () => void;
  billingLoading: boolean;
  methodsLoading: boolean;
  billingError: string;
  methodsError: string;
  refreshBilling: () => void;
  refreshMethods: () => void;
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

  const queryClient = useQueryClient();
  const refreshBillingCache = () => { for (const key of ["invoices", "methods", "wallet", "shipments"]) void queryClient.invalidateQueries({queryKey:[key]}); };
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

  const billingQuery = useCustomerQuery(customerQueries.invoices);
  const methodsQuery = useCustomerQuery(customerQueries.methods);
  const walletQuery = useCustomerQuery(customerQueries.wallet);
  const billingLoading = billingQuery.status === "loading";
  const methodsLoading = methodsQuery.status === "loading";
  const billingError = billingQuery.errorMessage;
  const methodsError = methodsQuery.errorMessage;
  useEffect(() => {
    const next = (billingQuery.data ?? []).map(displayInvoiceFromCustomerInvoice);
    setInvoices(next);
    selectInvoice(current => current && next.some(item => item.id === current) ? current : next.find(item => item.status === "unpaid")?.id ?? next[0]?.id);
  }, [billingQuery.data]);
  useEffect(() => {
    const methods = methodsQuery.data ?? [];
    setPaymentMethods(methods);
    setSelectedPaymentMethodId(current => current && methods.some(item => item.id === current) ? current : getDefaultPaymentMethod(methods)?.id);
  }, [methodsQuery.data]);
  useEffect(() => {
    if (walletQuery.data) { setWalletBalance(walletQuery.data.balance); setWalletActivity(walletQuery.data.activity); }
  }, [walletQuery.data]);

  const selectedInvoice = invoices.find((invoice) => invoice.id === selectedInvoiceId);
  const selectedSavedPaymentMethod = paymentMethods.find((item) => item.id === selectedPaymentMethodId) ?? getDefaultPaymentMethod(paymentMethods);
  const selectedPaymentMethod = selectedSavedPaymentMethod?.method ?? "mobile";
  const setSelectedPaymentMethod = (method: MockPaymentMethod) => setSelectedPaymentMethodId(paymentMethods.find((item) => item.method === method)?.id);
  const selectSavedPaymentMethod = (methodId: string) => setSelectedPaymentMethodId(methodId);
  const setDefaultPaymentMethod = (methodId: string) => {
    setActionError("");
    void repositories.billingActions.setDefaultPaymentMethod(methodId).then(methods => {setPaymentMethods(methods); refreshBillingCache();}).catch(() => setActionError("We could not change the default payment method. Please try again."));
  };
  const addPaymentMethod = (method: Exclude<MockPaymentMethod, "wallet">) => {
    setActionError("");
    void repositories.billingActions.savePaymentMethod(method).then((saved) => {setPaymentMethods((current) => current.some((item) => item.id === saved.id) ? current : [...current, saved]); refreshBillingCache();}).catch(() => {
      if (useLiveBillingActions) { setActionError("We could not save that payment method. Please try again."); return; }
      setPaymentMethods((current) => [...current, { id: `${method}-${current.length + 1}`, method, label: method === "mobile" ? "Mobile money" : "Bank card", detail: method === "mobile" ? "Airtel · 097 555 0124" : "Visa ·•••• 6620" }]);
    });
  };
  const removePaymentMethod = (methodId: string) => {
    setActionError("");
    void repositories.billingActions.removePaymentMethod(methodId).then(() => {
      refreshBillingCache();
      setPaymentMethods((current) => { const next = current.filter((item) => item.id !== methodId); const selectedRemoved = methodId === selectedPaymentMethodId; if (selectedRemoved) setSelectedPaymentMethodId(getDefaultPaymentMethod(next)?.id); return next.some((item) => item.isDefault) ? next : next.map((item, index) => ({ ...item, isDefault: index === 0 })); });
    }).catch(() => setActionError("We could not remove that payment method. Please try again."));
  };
  const confirmSelectedInvoicePayment = () => {
    if (!selectedInvoiceId || !selectedInvoice) return;
    if (selectedPaymentMethod === "wallet" && !canPayWithDisplayWallet(walletBalance, selectedInvoice)) { setPaymentState("failed"); return; }
    void repositories.billingActions.confirmInvoicePayment({ invoice: { id: selectedInvoice.id, reference: selectedInvoice.reference, amount: { amount: selectedInvoice.amountValue, currencyCode: "ZMW", formatted: selectedInvoice.amount } }, method: selectedPaymentMethod, walletBalance }).then((result) => {
      refreshBillingCache();
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
  const value: CustomerBillingAccountContextValue = { walletLoading: walletQuery.status === "loading", walletError: walletQuery.data ? "" : walletQuery.errorMessage, refreshWallet: () => {void walletQuery.refetch();}, billingLoading, methodsLoading, billingError, methodsError, refreshBilling: () => { void billingQuery.refetch(); }, refreshMethods: () => { void methodsQuery.refetch(); }, paymentState, invoices, selectedInvoiceId, selectedInvoice, lastPaidInvoiceId, selectedPaymentMethod, paymentMethods, selectedPaymentMethodId, walletBalance, walletActivity, reminders, actionError, clearActionError: () => setActionError(""), setPaymentState, selectInvoice, setSelectedPaymentMethod, selectSavedPaymentMethod, setDefaultPaymentMethod, addPaymentMethod, removePaymentMethod, confirmSelectedInvoicePayment, topUpWallet, toggleInvoiceReminder, submitInvoiceDispute };
  return <CustomerBillingAccountContext.Provider value={value}>{children}</CustomerBillingAccountContext.Provider>;
}

export function useCustomerBillingAccount() {
  const context = useContext(CustomerBillingAccountContext);
  if (!context) throw new Error("useCustomerBillingAccount must be used within CustomerBillingAccountProvider");
  return context;
}
