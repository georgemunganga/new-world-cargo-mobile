import { canPayWithWallet, paymentMethodLabel, type CustomerInvoice, type PaymentMethod, type SavedPaymentMethod, type WalletActivity } from "@/lib/domain/billing";
import { mockSavedPaymentMethods, mockWalletStartingBalance } from "@/lib/mock-billing";
import type { BillingActionsRepository } from "@/lib/repositories/types";

const paymentMethods: SavedPaymentMethod[] = [...mockSavedPaymentMethods];
let walletBalance = mockWalletStartingBalance;
let walletActivity: WalletActivity[] = [{ id: "wallet-opening", label: "Wallet balance", detail: "Opening mock balance", amount: mockWalletStartingBalance, type: "topup", time: "1 Sep" }];

export const mockBillingActionsRepository: BillingActionsRepository = {
  async listPaymentMethods() {
    return paymentMethods;
  },
  async savePaymentMethod(method: Exclude<PaymentMethod, "wallet">) {
    const saved = { id: `${method}-${paymentMethods.length + 1}`, method, label: method === "mobile" ? "Mobile money" : "Bank card", detail: method === "mobile" ? "Airtel · 097 555 0124" : "Visa ·•••• 6620" };
    paymentMethods.push(saved);
    return saved;
  },
  async removePaymentMethod(methodId) {
    const index = paymentMethods.findIndex((method) => method.id === methodId && method.method !== "wallet");
    if (index >= 0) paymentMethods.splice(index, 1);
    if (!paymentMethods.some((method) => method.isDefault) && paymentMethods[0]) paymentMethods[0].isDefault = true;
  },
  async setDefaultPaymentMethod(methodId) {
    paymentMethods.forEach((method) => {
      method.isDefault = method.id === methodId;
    });
    return paymentMethods;
  },
  async getWallet() {
    return { balance: walletBalance, activity: walletActivity };
  },
  async topUpWallet(amount) {
    walletBalance += amount;
    walletActivity = [{ id: `wallet-topup-${Date.now()}`, label: "Wallet top-up", detail: "Mock top-up confirmed", amount, type: "topup", time: "Just now" }, ...walletActivity];
    return { balance: walletBalance, activity: walletActivity };
  },
  async confirmInvoicePayment(input) {
    if (input.method === "wallet" && !canPayWithWallet(input.walletBalance, input.invoice)) return { state: "failed" };
    if (input.method === "wallet") {
      walletBalance = input.walletBalance - input.invoice.amount.amount;
      const activity = { id: `wallet-payment-${input.invoice.id}`, label: `Paid ${input.invoice.reference}`, detail: "Invoice payment", amount: -input.invoice.amount.amount, type: "payment" as const, time: "Just now" };
      walletActivity = [activity, ...walletActivity];
      return { state: "confirmed", paidAt: "Just now", paymentMethodLabel: paymentMethodLabel(input.method), walletBalance, walletActivity: activity };
    }
    return { state: "confirmed", paidAt: "Just now", paymentMethodLabel: paymentMethodLabel(input.method) };
  },
  async setInvoiceReminder() {
    return undefined;
  },
  async disputeInvoice() {
    return {
      kind: "dispute" as const,
      title: "Charge review started",
      detail: "A support case is open. We will keep your invoice visible while the charge is reviewed.",
      events: [
        { label: "Review requested", detail: "Your question was sent to New WorldCargo support.", time: "Just now", complete: true },
        { label: "Charge review", detail: "A specialist will review the shipment and charges.", time: "Next update pending", complete: false },
      ],
    } satisfies CustomerInvoice["resolution"];
  },
};
