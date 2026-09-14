import { apiClient } from "@/lib/api/client";
import type { CustomerInvoice, PaymentMethod, SavedPaymentMethod, WalletActivity, WalletSnapshot } from "@/lib/domain/billing";
import type { BillingActionsRepository } from "@/lib/repositories/types";

type PortalMoney = { currency?: string; amountMinor?: number | string };
type LaravelWalletResponse = { balance?: number | string; activity?: WalletActivity[]; availableBalance?: PortalMoney; pendingBalance?: PortalMoney };
type LaravelWalletLedgerResponse = { id?: string | number; type?: string; status?: string; amount?: PortalMoney; createdAt?: string | null };
type LaravelPaymentIntentResponse = { id?: string; status?: string; clientToken?: string | null; providerReference?: string | null };
type LaravelPaymentMethodResponse = SavedPaymentMethod;
type LaravelResolutionResponse = NonNullable<CustomerInvoice["resolution"]>;

export function paymentStateFromProvider(status?: string): "confirmed" | "failed" | "delayed" {
  if (["succeeded", "confirmed", "completed"].includes(status ?? "")) return "confirmed";
  if (["requires_action", "processing", "pending"].includes(status ?? "")) return "delayed";
  return "failed";
}

function mapWallet(raw: LaravelWalletResponse): WalletSnapshot {
  const balance = raw.availableBalance ? Number(raw.availableBalance.amountMinor ?? 0) / 100 : typeof raw.balance === "number" ? raw.balance : Number(raw.balance ?? 0);
  return { balance: Number.isFinite(balance) ? balance : 0, activity: raw.activity ?? [] };
}

function mapWalletActivity(raw: LaravelWalletLedgerResponse): WalletActivity {
  const amount = Number(raw.amount?.amountMinor ?? 0) / 100;
  return {
    id: String(raw.id ?? raw.createdAt ?? Date.now()),
    label: raw.type === "payment" ? "Wallet payment" : "Wallet activity",
    detail: raw.status ?? "Posted",
    amount: Number.isFinite(amount) ? amount : 0,
    type: raw.type === "payment" ? "payment" : "topup",
    time: raw.createdAt ?? "Recently",
  };
}

async function getWalletSnapshot(): Promise<WalletSnapshot> {
  const [wallet, activity] = await Promise.all([
    apiClient.get<{ data: LaravelWalletResponse }>("/api/v1/wallet"),
    apiClient.get<{ data: LaravelWalletLedgerResponse[] }>("/api/v1/wallet/transactions"),
  ]);
  return { ...mapWallet(wallet.data), activity: activity.data.map(mapWalletActivity) };
}

export const laravelBillingActionsRepository: BillingActionsRepository = {
  async listPaymentMethods() {
    const response = await apiClient.get<{ data: LaravelPaymentMethodResponse[] }>("/api/v1/payment-methods");
    return response.data.map((method) => ({ ...method, method: method.method === "wallet" ? "mobile" : (method.method as PaymentMethod) }));
  },
  async savePaymentMethod(method: Exclude<PaymentMethod, "wallet">) {
    const response = await apiClient.post<{ data: LaravelPaymentMethodResponse }>("/api/v1/payment-methods", {
      method,
      label: method === "card" ? "Bank card" : "Mobile money",
      detail: "Saved for faster checkout",
    });
    return response.data;
  },
  async removePaymentMethod(methodId) {
    await apiClient.delete(`/api/v1/payment-methods/${encodeURIComponent(methodId)}`);
  },
  async setDefaultPaymentMethod(methodId) {
    const response = await apiClient.patch<{ data: LaravelPaymentMethodResponse[] }>(`/api/v1/payment-methods/${encodeURIComponent(methodId)}/default`);
    return response.data;
  },
  async getWallet() {
    return getWalletSnapshot();
  },
  async topUpWallet(amount) {
    await apiClient.post<{ data: LaravelWalletResponse }>("/api/v1/wallet/top-ups", { amount });
    return getWalletSnapshot();
  },
  async confirmInvoicePayment(input) {
    const method = input.method === "card" ? "card" : "mobile-money";
    const response = await apiClient.post<{ data: LaravelPaymentIntentResponse }>("/api/v1/payments/intents", {
      invoiceId: Number(input.invoice.id),
      method,
    });
    return {
      state: paymentStateFromProvider(response.data.status),
      paymentMethodLabel: input.method === "card" ? "Bank card" : "Mobile money",
    };
  },
  async setInvoiceReminder(invoiceId, enabled) {
    await apiClient.patch(`/api/v1/invoices/${encodeURIComponent(invoiceId)}/reminder`, { enabled });
  },
  async disputeInvoice(invoiceId) {
    const response = await apiClient.post<{ data: LaravelResolutionResponse }>(`/api/v1/invoices/${encodeURIComponent(invoiceId)}/disputes`);
    return response.data;
  },
};
