import {
  canPayWithDisplayWallet,
  calculateDisplayOutstandingBalance,
  filterDisplayInvoices,
  formatKwacha,
  invoiceReminderLabel,
  paymentMethodDetail as domainPaymentMethodDetail,
  paymentMethodIcon,
  paymentMethodLabel as domainPaymentMethodLabel,
  paymentPresentation,
  type BillingDisplayInvoice,
  type PaymentMethod,
  type PaymentState,
  type SavedPaymentMethod,
  type WalletActivity,
} from "@/lib/domain/billing";

export type MockPaymentState = PaymentState;
export type MockInvoiceStatus = BillingDisplayInvoice["status"];
export type MockPaymentMethod = PaymentMethod;
export type MockSavedPaymentMethod = SavedPaymentMethod;

export type MockInvoiceLineItem = BillingDisplayInvoice["lineItems"][number];
export type MockResolutionEvent = NonNullable<BillingDisplayInvoice["resolution"]>["events"][number];
export type MockInvoiceResolution = NonNullable<BillingDisplayInvoice["resolution"]>;
export type MockInvoice = BillingDisplayInvoice;

export type MockWalletActivity = WalletActivity;
export const mockWalletStartingBalance = 1750;
export const mockSavedPaymentMethods: MockSavedPaymentMethod[] = [
  { id: "wallet", method: "wallet", label: "Cargo Wallet", detail: "Available balance", isDefault: true },
  { id: "mobile-096", method: "mobile", label: "Mobile money", detail: "MTN · 096 234 0187" },
  { id: "card-1048", method: "card", label: "Bank card", detail: "Visa ·•••• 1048" },
];

export const mockInvoices: MockInvoice[] = [
  { id: "inv-2608-014", reference: "INV-2608-014", shipmentReference: "NWC-23990", description: "Import cargo final charge", shipmentLabel: "Homeware order", route: "Dubai · Jebel Ali to Lusaka · Kabwata", amount: "K 1,280.00", amountValue: 1280, currencyDetail: "Zambian kwacha · mock development amount", issuedAt: "26 Aug 2026", dueAt: "4 Sep 2026", status: "unpaid", lineItems: [{ label: "International handling", detail: "Consolidation and receiving", amount: "K 860.00" }, { label: "Customs coordination", detail: "Document handling", amount: "K 300.00" }, { label: "Final collection", detail: "Lusaka branch", amount: "K 120.00" }] },
  { id: "inv-2608-009", reference: "INV-2608-009", shipmentReference: "NWC-24518", description: "International freight balance", shipmentLabel: "International cargo", route: "China · Guangzhou to Lusaka · Roma", amount: "K 2,450.00", amountValue: 2450, currencyDetail: "Zambian kwacha · mock development amount", issuedAt: "22 Aug 2026", dueAt: "1 Sep 2026", status: "unpaid", lineItems: [{ label: "Air freight", detail: "Guangzhou to Lusaka", amount: "K 1,970.00" }, { label: "Cargo protection", amount: "K 180.00" }, { label: "Import processing", amount: "K 300.00" }] },
  { id: "inv-2608-003", reference: "INV-2608-003", shipmentReference: "NWC-23411", description: "Local delivery", shipmentLabel: "Document envelope", route: "Lusaka · Woodlands to Rhodes Park", amount: "K 82.00", amountValue: 82, currencyDetail: "Zambian kwacha · mock development amount", issuedAt: "18 Aug 2026", paidAt: "18 Aug 2026", paymentMethod: "Mobile money", status: "paid", lineItems: [{ label: "Local delivery", detail: "Door-to-door", amount: "K 68.00" }, { label: "Document handling", amount: "K 14.00" }] },
  { id: "inv-2607-021", reference: "INV-2607-021", shipmentReference: "NWC-24206", description: "Intercity cargo", shipmentLabel: "Two cartons", route: "Lusaka · Kabwata to Johannesburg · Gauteng", amount: "K 980.00", amountValue: 980, currencyDetail: "Zambian kwacha · mock development amount", issuedAt: "30 Jul 2026", paidAt: "30 Jul 2026", paymentMethod: "Cargo wallet", status: "paid", lineItems: [{ label: "Intercity freight", detail: "Two cartons", amount: "K 900.00" }, { label: "Collection handling", amount: "K 80.00" }], resolution: { kind: "refund", title: "Refund processing", detail: "A K 80.00 collection adjustment is being returned to your Cargo Wallet.", events: [{ label: "Refund requested", detail: "Your request was received.", time: "31 Aug, 09:20", complete: true }, { label: "Adjustment approved", detail: "The collection charge was adjusted.", time: "31 Aug, 14:10", complete: true }, { label: "Wallet credit pending", detail: "The credit will appear after confirmation.", time: "In progress", complete: false }] } },
];

export const mockInvoice = mockInvoices[0];

export const calculateOutstandingBalance = calculateDisplayOutstandingBalance;
export const filterMockInvoices = filterDisplayInvoices;
export const paymentMethodLabel = domainPaymentMethodLabel;
export { paymentMethodIcon };
export function paymentMethodDetail(method: MockPaymentMethod, walletBalance: number) { return domainPaymentMethodDetail(method, walletBalance, mockSavedPaymentMethods); }
export function getDefaultPaymentMethod(methods: MockSavedPaymentMethod[]) { return methods.find((item) => item.isDefault) ?? methods[0]; }
export const formatMockKwacha = formatKwacha;
export const canPayWithMockWallet = canPayWithDisplayWallet;
export function mockReminderLabel(invoice: MockInvoice) { if (invoice.status === "paid") return undefined; return invoice.dueAt === "1 Sep 2026" ? "Due today" : invoiceReminderLabel(invoice); }

export const mockPaymentPresentation = paymentPresentation;
