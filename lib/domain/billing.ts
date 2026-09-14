import type { Money } from "./money";

export type InvoiceStatus = "unpaid" | "paid" | "overdue" | "cancelled" | "disputed" | "refunded";

export type InvoiceLineItem = {
  label: string;
  detail?: string;
  amount: Money;
};

export type InvoiceResolutionEvent = {
  label: string;
  detail: string;
  time: string;
  complete: boolean;
};

export type InvoiceResolution = {
  kind: "refund" | "dispute";
  title: string;
  detail: string;
  events: InvoiceResolutionEvent[];
};

export type CustomerInvoice = {
  id: string;
  reference: string;
  shipmentCode?: string;
  description: string;
  shipmentLabel: string;
  route: string;
  status: InvoiceStatus;
  amount: Money;
  currencyDetail?: string;
  issuedAt?: string;
  dueAt?: string;
  paidAt?: string;
  paymentMethod?: string;
  lineItems: InvoiceLineItem[];
  resolution?: InvoiceResolution;
};

export type InvoiceStatusFilter = "all" | Extract<InvoiceStatus, "paid" | "unpaid">;

export type PaymentState = "ready" | "pending" | "confirmed" | "failed" | "cancelled" | "delayed" | "refunded";
export type PaymentMethod = "mobile" | "card" | "wallet";

export type SavedPaymentMethod = {
  id: string;
  method: PaymentMethod;
  label: string;
  detail: string;
  isDefault?: boolean;
};

export type WalletActivity = {
  id: string;
  label: string;
  detail: string;
  amount: number;
  type: "topup" | "payment";
  time: string;
};

export type WalletSnapshot = {
  balance: number;
  activity: WalletActivity[];
};

export type ConfirmInvoicePaymentInput = {
  invoice: Pick<CustomerInvoice, "id" | "reference" | "amount">;
  method: PaymentMethod;
  walletBalance: number;
};

export type ConfirmInvoicePaymentResult = {
  state: Extract<PaymentState, "confirmed" | "failed" | "delayed">;
  paidAt?: string;
  paymentMethodLabel?: string;
  walletActivity?: WalletActivity;
  walletBalance?: number;
};

export function calculateCustomerOutstandingBalance(invoices: CustomerInvoice[]) {
  return invoices.filter((invoice) => invoice.status === "unpaid" || invoice.status === "overdue").reduce((sum, invoice) => sum + invoice.amount.amount, 0);
}

export function filterCustomerInvoices(invoices: CustomerInvoice[], query: string, status: InvoiceStatusFilter) {
  const normalized = query.trim().toLowerCase();
  return invoices.filter((invoice) => {
    const matchesStatus = status === "all" || invoice.status === status;
    if (!matchesStatus) return false;
    if (!normalized) return true;
    return `${invoice.reference} ${invoice.shipmentCode ?? ""} ${invoice.shipmentLabel} ${invoice.route}`.toLowerCase().includes(normalized);
  });
}

export function paymentMethodLabel(method: PaymentMethod) {
  return { mobile: "Mobile money", card: "Bank card", wallet: "Cargo wallet" }[method];
}

export function canPayWithWallet(balance: number, invoice: Pick<CustomerInvoice, "amount">) {
  return balance >= invoice.amount.amount;
}

export type BillingDisplayInvoice = {
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
  status: Extract<InvoiceStatus, "paid" | "unpaid">;
  lineItems: { label: string; detail?: string; amount: string }[];
  resolution?: InvoiceResolution;
};

export function displayInvoiceFromCustomerInvoice(invoice: CustomerInvoice): BillingDisplayInvoice {
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

export function calculateDisplayOutstandingBalance(invoices: BillingDisplayInvoice[]) {
  return invoices.filter((invoice) => invoice.status === "unpaid").reduce((sum, invoice) => sum + invoice.amountValue, 0);
}

export function filterDisplayInvoices(invoices: BillingDisplayInvoice[], query: string, status: "all" | BillingDisplayInvoice["status"]) {
  const normalized = query.trim().toLowerCase();
  return invoices.filter((invoice) => {
    if (status !== "all" && invoice.status !== status) return false;
    if (!normalized) return true;
    return `${invoice.reference} ${invoice.shipmentReference} ${invoice.shipmentLabel} ${invoice.route}`.toLowerCase().includes(normalized);
  });
}

export function paymentMethodIcon(method: PaymentMethod) {
  return { mobile: "cellphone" as const, card: "credit-card-outline" as const, wallet: "wallet-outline" as const }[method];
}

export function formatKwacha(value: number) {
  return `K ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function paymentMethodDetail(method: PaymentMethod, walletBalance: number, methods: SavedPaymentMethod[] = []) {
  return method === "wallet" ? `Available ${formatKwacha(walletBalance)}` : methods.find((item) => item.method === method)?.detail ?? paymentMethodLabel(method);
}

export function canPayWithDisplayWallet(balance: number, invoice: Pick<BillingDisplayInvoice, "amountValue">) {
  return canPayWithWallet(balance, { amount: { amount: invoice.amountValue, currencyCode: "ZMW", formatted: formatKwacha(invoice.amountValue) } });
}

export function invoiceReminderLabel(invoice: Pick<BillingDisplayInvoice, "status" | "dueAt">) {
  if (invoice.status === "paid") return undefined;
  return invoice.dueAt ? `Due ${invoice.dueAt}` : "Due reminder";
}

export function paymentPresentation(state: PaymentState) {
  return {
    ready: { eyebrow: "Payment required", title: "Your payment is ready.", detail: "Review the invoice and choose a payment method.", tone: "warning" as const, icon: "receipt-text-outline" as const },
    pending: { eyebrow: "Payment pending", title: "We are confirming your payment.", detail: "Keep this screen open while the payment provider responds.", tone: "info" as const, icon: "clock-time-four-outline" as const },
    confirmed: { eyebrow: "Payment confirmed", title: "Payment received.", detail: "Your selected invoice is marked as paid. The receipt is ready to view.", tone: "primary" as const, icon: "check-circle-outline" as const },
    failed: { eyebrow: "Payment not completed", title: "Your payment did not go through.", detail: "No charge was made. Choose another method or return to the invoice.", tone: "error" as const, icon: "alert-circle-outline" as const },
    cancelled: { eyebrow: "Payment cancelled", title: "You cancelled this payment.", detail: "Your invoice remains ready to pay. You can return when you are ready.", tone: "warning" as const, icon: "close-circle-outline" as const },
    delayed: { eyebrow: "Confirmation delayed", title: "We need a little more time.", detail: "Do not make another payment while confirmation is pending. We will update the receipt when the provider responds.", tone: "info" as const, icon: "clock-alert-outline" as const },
    refunded: { eyebrow: "Refund update", title: "Your refund is processing.", detail: "The refunded amount and timing will appear here when the payment provider confirms it.", tone: "info" as const, icon: "cash-refund" as const },
  }[state];
}
