import { apiClient } from "@/lib/api/client";
import type { PaymentMethod, WalletActivity, WalletSnapshot } from "@/lib/domain/billing";
import type { BillingActionsRepository } from "@/lib/repositories/types";
import { missingPortalContract } from "./portal-contract-gap";

type PortalMoney = { currency?: string; amountMinor?: number | string };
type LaravelWalletResponse = { balance?: number | string; activity?: WalletActivity[]; availableBalance?: PortalMoney; pendingBalance?: PortalMoney };
type LaravelWalletLedgerResponse = { id?: string | number; type?: string; status?: string; amount?: PortalMoney; createdAt?: string | null };
type LaravelPaymentIntentResponse = { id?: string; status?: string; clientToken?: string | null; providerReference?: string | null };

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

export const laravelBillingActionsRepository: BillingActionsRepository = {
  async listPaymentMethods() {
    missingPortalContract("Saved payment methods");
  },
  async savePaymentMethod(method: Exclude<PaymentMethod, "wallet">) {
    void method;
    missingPortalContract("Saving payment methods");
  },
  async removePaymentMethod(methodId) {
    void methodId;
    missingPortalContract("Removing payment methods");
  },
  async setDefaultPaymentMethod(methodId) {
    void methodId;
    missingPortalContract("Default payment method selection");
  },
  async getWallet() {
    const [wallet, activity] = await Promise.all([
      apiClient.get<{ data: LaravelWalletResponse }>("/api/v1/wallet"),
      apiClient.get<{ data: LaravelWalletLedgerResponse[] }>("/api/v1/wallet/transactions"),
    ]);
    return { ...mapWallet(wallet.data), activity: activity.data.map(mapWalletActivity) };
  },
  async topUpWallet(amount) {
    void amount;
    missingPortalContract("Wallet top-ups");
  },
  async confirmInvoicePayment(input) {
    const method = input.method === "card" ? "card" : "mobile-money";
    const response = await apiClient.post<{ data: LaravelPaymentIntentResponse }>("/api/v1/payments/intents", {
      invoiceId: Number(input.invoice.id),
      method,
    });
    return {
      state: response.data.status === "requires_action" ? "delayed" : "confirmed",
      paymentMethodLabel: input.method === "card" ? "Bank card" : "Mobile money",
    };
  },
  async setInvoiceReminder(invoiceId, enabled) {
    void invoiceId;
    void enabled;
    missingPortalContract("Invoice payment reminders");
  },
  async disputeInvoice(invoiceId) {
    void invoiceId;
    missingPortalContract("Invoice disputes");
  },
};
