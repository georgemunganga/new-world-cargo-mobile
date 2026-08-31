export type MockPaymentState = "ready" | "pending" | "confirmed" | "failed" | "cancelled" | "delayed" | "refunded";

export const mockInvoice = {
  reference: "INV-2608-014",
  shipmentReference: "NWC-23990",
  description: "Import Cargo final charge",
  amount: "K 1,280.00",
  currencyDetail: "Zambian kwacha · mock development amount",
  dueLabel: "Payment action required",
};

export function mockPaymentPresentation(state: MockPaymentState) {
  return {
    ready: { eyebrow: "Payment required", title: "Your payment is ready.", detail: "Review the invoice and choose a mock payment method. No payment will be sent in this frontend build.", tone: "warning" as const, icon: "receipt-text-outline" as const },
    pending: { eyebrow: "Payment pending", title: "We are confirming your payment.", detail: "Keep this screen open while the payment provider responds. This preview lets you move to the next state manually.", tone: "info" as const, icon: "clock-time-four-outline" as const },
    confirmed: { eyebrow: "Payment confirmed", title: "Payment received.", detail: "Your invoice is marked as paid in this frontend preview. The receipt is ready to view.", tone: "primary" as const, icon: "check-circle-outline" as const },
    failed: { eyebrow: "Payment not completed", title: "Your payment did not go through.", detail: "No charge was made in this mock experience. Choose another method or return to the invoice.", tone: "error" as const, icon: "alert-circle-outline" as const },
    cancelled: { eyebrow: "Payment cancelled", title: "You cancelled this payment.", detail: "Your invoice remains ready to pay. You can return when you are ready.", tone: "warning" as const, icon: "close-circle-outline" as const },
    delayed: { eyebrow: "Confirmation delayed", title: "We need a little more time.", detail: "Do not make another payment while confirmation is pending. We will update the receipt state when the provider responds.", tone: "info" as const, icon: "clock-alert-outline" as const },
    refunded: { eyebrow: "Refund update", title: "Your refund is processing.", detail: "The refunded amount and timing will appear here when the payment provider confirms it.", tone: "info" as const, icon: "cash-refund" as const },
  }[state];
}
