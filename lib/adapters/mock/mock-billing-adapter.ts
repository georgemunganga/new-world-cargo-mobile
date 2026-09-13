import { mockInvoices } from "@/lib/mock-billing";
import { formatMoney } from "@/lib/domain/money";
import type { BillingRepository } from "@/lib/repositories/types";

function amountValue(value: string) {
  const parsed = Number(value.replace(/[^\d.]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export const mockBillingRepository: BillingRepository = {
  async listInvoices() {
    return mockInvoices.map((invoice) => ({
      id: invoice.id,
      reference: invoice.reference,
      shipmentCode: invoice.shipmentReference,
      description: invoice.description,
      shipmentLabel: invoice.shipmentLabel,
      route: invoice.route,
      status: invoice.status,
      amount: {
        amount: invoice.amountValue ?? amountValue(invoice.amount),
        currencyCode: "ZMW",
        formatted: invoice.amount,
      },
      currencyDetail: invoice.currencyDetail,
      issuedAt: invoice.issuedAt,
      dueAt: invoice.dueAt,
      paidAt: invoice.paidAt,
      paymentMethod: invoice.paymentMethod,
      lineItems: invoice.lineItems.map((item) => ({
        label: item.label,
        ...(item.detail ? { detail: item.detail } : {}),
        amount: { amount: amountValue(item.amount), currencyCode: "ZMW", formatted: item.amount },
      })),
      ...(invoice.resolution ? { resolution: invoice.resolution } : {}),
    }));
  },
  async getInvoice(id) {
    const invoices = await this.listInvoices();
    return invoices.find((invoice) => invoice.id === id || invoice.reference === id) ?? null;
  },
};
