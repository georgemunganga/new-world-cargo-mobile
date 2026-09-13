import { apiClient } from "@/lib/api/client";
import type { ConfirmInvoicePaymentResult, CustomerInvoice, PaymentMethod, SavedPaymentMethod, WalletActivity, WalletSnapshot } from "@/lib/domain/billing";
import type { BillingActionsRepository } from "@/lib/repositories/types";

type LaravelPaymentMethodResponse = Partial<SavedPaymentMethod> & { type?: PaymentMethod; is_default?: boolean };
type LaravelWalletResponse = { balance?: number | string; activity?: WalletActivity[] };

function mapPaymentMethod(raw: LaravelPaymentMethodResponse): SavedPaymentMethod {
  const method = raw.method ?? raw.type ?? "mobile";
  return {
    id: String(raw.id ?? method),
    method,
    label: raw.label ?? (method === "wallet" ? "Cargo Wallet" : method === "card" ? "Bank card" : "Mobile money"),
    detail: raw.detail ?? "Payment method",
    isDefault: raw.isDefault ?? raw.is_default,
  };
}

function mapWallet(raw: LaravelWalletResponse): WalletSnapshot {
  const balance = typeof raw.balance === "number" ? raw.balance : Number(raw.balance ?? 0);
  return { balance: Number.isFinite(balance) ? balance : 0, activity: raw.activity ?? [] };
}

export const laravelBillingActionsRepository: BillingActionsRepository = {
  async listPaymentMethods() {
    const response = await apiClient.get<{ data: LaravelPaymentMethodResponse[] }>("/api/customer/payment-methods");
    return response.data.map(mapPaymentMethod);
  },
  async savePaymentMethod(method: Exclude<PaymentMethod, "wallet">) {
    const response = await apiClient.post<{ data: LaravelPaymentMethodResponse }>("/api/customer/payment-methods", { method });
    return mapPaymentMethod(response.data);
  },
  async removePaymentMethod(methodId) {
    await apiClient.delete(`/api/customer/payment-methods/${encodeURIComponent(methodId)}`);
  },
  async setDefaultPaymentMethod(methodId) {
    const response = await apiClient.patch<{ data: LaravelPaymentMethodResponse[] }>(`/api/customer/payment-methods/${encodeURIComponent(methodId)}/default`);
    return response.data.map(mapPaymentMethod);
  },
  async getWallet() {
    const response = await apiClient.get<{ data: LaravelWalletResponse }>("/api/customer/wallet");
    return mapWallet(response.data);
  },
  async topUpWallet(amount) {
    const response = await apiClient.post<{ data: LaravelWalletResponse }>("/api/customer/wallet/top-ups", { amount });
    return mapWallet(response.data);
  },
  async confirmInvoicePayment(input) {
    const response = await apiClient.post<{ data: ConfirmInvoicePaymentResult }>(`/api/customer/invoices/${encodeURIComponent(input.invoice.id)}/payments`, {
      method: input.method,
      amount: input.invoice.amount.amount,
      currency: input.invoice.amount.currencyCode,
    });
    return response.data;
  },
  async setInvoiceReminder(invoiceId, enabled) {
    await apiClient.patch(`/api/customer/invoices/${encodeURIComponent(invoiceId)}/reminder`, { enabled });
  },
  async disputeInvoice(invoiceId) {
    const response = await apiClient.post<{ data: CustomerInvoice["resolution"] }>(`/api/customer/invoices/${encodeURIComponent(invoiceId)}/disputes`);
    return response.data;
  },
};
