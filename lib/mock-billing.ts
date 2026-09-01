export type MockPaymentState = "ready" | "pending" | "confirmed" | "failed" | "cancelled" | "delayed" | "refunded";
export type MockInvoiceStatus = "paid" | "unpaid";
export type MockPaymentMethod = "mobile" | "card" | "wallet";

export type MockInvoiceLineItem = { label: string; detail?: string; amount: string };
export type MockResolutionEvent = { label: string; detail: string; time: string; complete: boolean };
export type MockInvoiceResolution = { kind: "refund" | "dispute"; title: string; detail: string; events: MockResolutionEvent[] };
export type MockInvoice = {
  id: string;
  reference: string;
  shipmentReference: string;
  description: string;
  shipmentLabel: string;
  route: string;
  amount: string;
  amountValue: number;
  currencyDetail: string;
  issuedAt: string;
  dueAt?: string;
  paidAt?: string;
  paymentMethod?: string;
  status: MockInvoiceStatus;
  lineItems: MockInvoiceLineItem[];
  resolution?: MockInvoiceResolution;
};

export type MockWalletActivity = { id: string; label: string; detail: string; amount: number; type: "topup" | "payment"; time: string };
export const mockWalletStartingBalance = 1750;

export const mockInvoices: MockInvoice[] = [
  { id: "inv-2608-014", reference: "INV-2608-014", shipmentReference: "NWC-23990", description: "Import cargo final charge", shipmentLabel: "Homeware order", route: "Dubai · Jebel Ali to Lusaka · Kabwata", amount: "K 1,280.00", amountValue: 1280, currencyDetail: "Zambian kwacha · mock development amount", issuedAt: "26 Aug 2026", dueAt: "4 Sep 2026", status: "unpaid", lineItems: [{ label: "International handling", detail: "Consolidation and receiving", amount: "K 860.00" }, { label: "Customs coordination", detail: "Document handling", amount: "K 300.00" }, { label: "Final collection", detail: "Lusaka branch", amount: "K 120.00" }] },
  { id: "inv-2608-009", reference: "INV-2608-009", shipmentReference: "NWC-24518", description: "International freight balance", shipmentLabel: "International cargo", route: "China · Guangzhou to Lusaka · Roma", amount: "K 2,450.00", amountValue: 2450, currencyDetail: "Zambian kwacha · mock development amount", issuedAt: "22 Aug 2026", dueAt: "1 Sep 2026", status: "unpaid", lineItems: [{ label: "Air freight", detail: "Guangzhou to Lusaka", amount: "K 1,970.00" }, { label: "Cargo protection", amount: "K 180.00" }, { label: "Import processing", amount: "K 300.00" }] },
  { id: "inv-2608-003", reference: "INV-2608-003", shipmentReference: "NWC-23411", description: "Local delivery", shipmentLabel: "Document envelope", route: "Lusaka · Woodlands to Rhodes Park", amount: "K 82.00", amountValue: 82, currencyDetail: "Zambian kwacha · mock development amount", issuedAt: "18 Aug 2026", paidAt: "18 Aug 2026", paymentMethod: "Mobile money", status: "paid", lineItems: [{ label: "Local delivery", detail: "Door-to-door", amount: "K 68.00" }, { label: "Document handling", amount: "K 14.00" }] },
  { id: "inv-2607-021", reference: "INV-2607-021", shipmentReference: "NWC-24206", description: "Intercity cargo", shipmentLabel: "Two cartons", route: "Lusaka · Kabwata to Johannesburg · Gauteng", amount: "K 980.00", amountValue: 980, currencyDetail: "Zambian kwacha · mock development amount", issuedAt: "30 Jul 2026", paidAt: "30 Jul 2026", paymentMethod: "Cargo wallet", status: "paid", lineItems: [{ label: "Intercity freight", detail: "Two cartons", amount: "K 900.00" }, { label: "Collection handling", amount: "K 80.00" }], resolution: { kind: "refund", title: "Refund processing", detail: "A K 80.00 collection adjustment is being returned to your Cargo Wallet.", events: [{ label: "Refund requested", detail: "Your request was received.", time: "31 Aug, 09:20", complete: true }, { label: "Adjustment approved", detail: "The collection charge was adjusted.", time: "31 Aug, 14:10", complete: true }, { label: "Wallet credit pending", detail: "The credit will appear after confirmation.", time: "In progress", complete: false }] } },
];

export const mockInvoice = mockInvoices[0];

export function calculateOutstandingBalance(invoices: MockInvoice[]) { return invoices.filter((invoice) => invoice.status === "unpaid").reduce((sum, invoice) => sum + invoice.amountValue, 0); }
export function filterMockInvoices(invoices: MockInvoice[], query: string, status: "all" | MockInvoiceStatus) { const normalized = query.trim().toLowerCase(); return invoices.filter((invoice) => (status === "all" || invoice.status === status) && (!normalized || `${invoice.reference} ${invoice.shipmentReference} ${invoice.shipmentLabel} ${invoice.route}`.toLowerCase().includes(normalized))); }
export function paymentMethodLabel(method: MockPaymentMethod) { return { mobile: "Mobile money", card: "Bank card", wallet: "Cargo wallet" }[method]; }
export function formatMockKwacha(value: number) { return `K ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`; }
export function canPayWithMockWallet(balance: number, invoice: Pick<MockInvoice, "amountValue">) { return balance >= invoice.amountValue; }
export function mockReminderLabel(invoice: MockInvoice) { if (invoice.status === "paid") return undefined; return invoice.dueAt === "1 Sep 2026" ? "Due today" : "Due in 3 days"; }

export function mockPaymentPresentation(state: MockPaymentState) {
  return {
    ready: { eyebrow: "Payment required", title: "Your payment is ready.", detail: "Review the invoice and choose a mock payment method. No payment will be sent in this frontend build.", tone: "warning" as const, icon: "receipt-text-outline" as const },
    pending: { eyebrow: "Payment pending", title: "We are confirming your payment.", detail: "Keep this screen open while the payment provider responds. This preview lets you move to the next state manually.", tone: "info" as const, icon: "clock-time-four-outline" as const },
    confirmed: { eyebrow: "Payment confirmed", title: "Payment received.", detail: "Your selected invoice is marked as paid in this frontend preview. The receipt is ready to view.", tone: "primary" as const, icon: "check-circle-outline" as const },
    failed: { eyebrow: "Payment not completed", title: "Your payment did not go through.", detail: "No charge was made in this mock experience. Choose another method or return to the invoice.", tone: "error" as const, icon: "alert-circle-outline" as const },
    cancelled: { eyebrow: "Payment cancelled", title: "You cancelled this payment.", detail: "Your invoice remains ready to pay. You can return when you are ready.", tone: "warning" as const, icon: "close-circle-outline" as const },
    delayed: { eyebrow: "Confirmation delayed", title: "We need a little more time.", detail: "Do not make another payment while confirmation is pending. We will update the receipt state when the provider responds.", tone: "info" as const, icon: "clock-alert-outline" as const },
    refunded: { eyebrow: "Refund update", title: "Your refund is processing.", detail: "The refunded amount and timing will appear here when the payment provider confirms it.", tone: "info" as const, icon: "cash-refund" as const },
  }[state];
}
