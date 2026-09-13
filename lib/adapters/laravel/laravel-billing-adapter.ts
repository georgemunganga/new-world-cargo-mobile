import { apiClient } from "@/lib/api/client";
import type { CustomerInvoice } from "@/lib/domain/billing";
import type { Money } from "@/lib/domain/money";
import type { BillingRepository } from "@/lib/repositories/types";

type LaravelInvoiceLineItemResponse = {
  label?: string;
  detail?: string;
  amount?: Money | string | number;
  amount_value?: number | string;
};

type LaravelInvoiceResponse = {
  id?: string | number;
  reference?: string;
  shipmentCode?: string;
  shipment_code?: string;
  shipment_reference?: string;
  description?: string;
  shipmentLabel?: string;
  shipment_label?: string;
  route?: string;
  route_label?: string;
  status?: CustomerInvoice["status"];
  amount?: Money | string | number;
  amount_value?: number | string;
  currency?: string;
  currency_code?: string;
  formatted_amount?: string;
  issuedAt?: string;
  issued_at?: string;
  dueAt?: string;
  due_at?: string;
  paidAt?: string;
  paid_at?: string;
  paymentMethod?: string;
  payment_method?: string;
  lineItems?: LaravelInvoiceLineItemResponse[];
  line_items?: LaravelInvoiceLineItemResponse[];
  currencyDetail?: string;
  resolution?: CustomerInvoice["resolution"];
};

function moneyFrom(value: LaravelInvoiceResponse["amount"], fallbackValue?: string | number, currency = "ZMW"): Money {
  if (value && typeof value === "object" && "amount" in value) return value as Money;
  const formatted = typeof value === "string" ? value : undefined;
  const raw = fallbackValue ?? value ?? 0;
  const amount = typeof raw === "number" ? raw : Number(String(raw).replace(/[^\d.-]/g, ""));
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return {
    amount: safeAmount,
    currencyCode: currency,
    formatted: formatted ?? `${currency} ${safeAmount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
  };
}

function mapInvoice(raw: LaravelInvoiceResponse): CustomerInvoice {
  const currency = raw.currency_code ?? raw.currency ?? (typeof raw.amount === "object" ? raw.amount.currencyCode : undefined) ?? "ZMW";
  const amount = moneyFrom(raw.amount ?? raw.formatted_amount, raw.amount_value, currency);
  return {
    id: String(raw.id ?? raw.reference ?? ""),
    reference: String(raw.reference ?? raw.id ?? "Invoice"),
    shipmentCode: raw.shipmentCode ?? raw.shipment_code ?? raw.shipment_reference,
    description: raw.description ?? "Cargo invoice",
    shipmentLabel: raw.shipmentLabel ?? raw.shipment_label ?? raw.shipmentCode ?? raw.shipment_code ?? "Cargo shipment",
    route: raw.route ?? raw.route_label ?? "Route to confirm",
    status: raw.status ?? "unpaid",
    amount,
    currencyDetail: raw.currencyDetail,
    issuedAt: raw.issuedAt ?? raw.issued_at,
    dueAt: raw.dueAt ?? raw.due_at,
    paidAt: raw.paidAt ?? raw.paid_at,
    paymentMethod: raw.paymentMethod ?? raw.payment_method,
    lineItems: (raw.lineItems ?? raw.line_items ?? []).map((item) => ({
      label: item.label ?? "Cargo charge",
      ...(item.detail ? { detail: item.detail } : {}),
      amount: moneyFrom(item.amount, item.amount_value, currency),
    })),
    ...(raw.resolution ? { resolution: raw.resolution } : {}),
  };
}

export const laravelBillingRepository: BillingRepository = {
  async listInvoices() {
    const response = await apiClient.get<{ data: LaravelInvoiceResponse[] }>("/api/customer/invoices");
    return response.data.map(mapInvoice);
  },
  async getInvoice(id) {
    const response = await apiClient.get<{ data: LaravelInvoiceResponse }>(`/api/customer/invoices/${encodeURIComponent(id)}`);
    return mapInvoice(response.data);
  },
};
