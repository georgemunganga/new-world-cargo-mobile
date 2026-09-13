import { apiClient } from "@/lib/api/client";
import type { CustomerInvoice } from "@/lib/domain/billing";
import type { Money } from "@/lib/domain/money";
import type { BillingRepository } from "@/lib/repositories/types";

type LaravelInvoiceLineItemResponse = {
  description?: string;
  label?: string;
  detail?: string;
  total?: PortalMoney | Money | string | number;
  amount?: Money | string | number;
  amount_value?: number | string;
};

type PortalMoney = { currency?: string; amountMinor?: number | string };

type LaravelInvoiceResponse = {
  id?: string | number;
  invoiceNumber?: string;
  reference?: string;
  shipmentCode?: string;
  shipment_code?: string;
  shipment_reference?: string;
  description?: string;
  shipmentLabel?: string;
  shipment_label?: string;
  route?: string | { origin?: string | null; destination?: string | null };
  route_label?: string;
  status?: CustomerInvoice["status"];
  total?: PortalMoney;
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

function moneyFrom(value: PortalMoney | Money | string | number | undefined, fallbackValue?: string | number, currency = "ZMW"): Money {
  if (value && typeof value === "object" && "amountMinor" in value) {
    const amount = Number(value.amountMinor ?? 0) / 100;
    const currencyCode = "currency" in value && value.currency ? value.currency : currency;
    return {
      amount,
      currencyCode,
      formatted: `${currencyCode} ${amount.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
    };
  }
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

function routeLabel(route: LaravelInvoiceResponse["route"], fallback?: string) {
  if (typeof route === "string") return route;
  if (route && typeof route === "object") {
    return [route.origin, route.destination].filter(Boolean).join(" → ") || fallback || "Route to confirm";
  }
  return fallback || "Route to confirm";
}

function mapInvoice(raw: LaravelInvoiceResponse): CustomerInvoice {
  const currency = raw.currency_code ?? raw.currency ?? raw.total?.currency ?? (typeof raw.amount === "object" && "currencyCode" in raw.amount ? raw.amount.currencyCode : undefined) ?? "ZMW";
  const amount = moneyFrom(raw.total ?? raw.amount ?? raw.formatted_amount, raw.amount_value, currency);
  return {
    id: String(raw.id ?? raw.reference ?? ""),
    reference: String(raw.reference ?? raw.invoiceNumber ?? raw.id ?? "Invoice"),
    shipmentCode: raw.shipmentCode ?? raw.shipment_code ?? raw.shipment_reference,
    description: raw.description ?? "Cargo invoice",
    shipmentLabel: raw.shipmentLabel ?? raw.shipment_label ?? raw.shipmentCode ?? raw.shipment_code ?? "Cargo shipment",
    route: routeLabel(raw.route, raw.route_label),
    status: raw.status ?? "unpaid",
    amount,
    currencyDetail: raw.currencyDetail,
    issuedAt: raw.issuedAt ?? raw.issued_at,
    dueAt: raw.dueAt ?? raw.due_at,
    paidAt: raw.paidAt ?? raw.paid_at,
    paymentMethod: raw.paymentMethod ?? raw.payment_method,
    lineItems: (raw.lineItems ?? raw.line_items ?? []).map((item) => ({
      label: item.label ?? item.description ?? "Cargo charge",
      ...(item.detail ? { detail: item.detail } : {}),
      amount: moneyFrom(item.total ?? item.amount, item.amount_value, currency),
    })),
    ...(raw.resolution ? { resolution: raw.resolution } : {}),
  };
}

export const laravelBillingRepository: BillingRepository = {
  async listInvoices() {
    const response = await apiClient.get<{ data: LaravelInvoiceResponse[] }>("/api/v1/invoices");
    return response.data.map(mapInvoice);
  },
  async getInvoice(id) {
    const response = await apiClient.get<{ data: LaravelInvoiceResponse }>(`/api/v1/invoices/${encodeURIComponent(id)}`);
    return mapInvoice(response.data);
  },
};
