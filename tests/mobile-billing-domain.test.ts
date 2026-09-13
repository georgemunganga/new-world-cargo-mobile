import { describe, expect, it } from "vitest";
import { calculateCustomerOutstandingBalance, filterCustomerInvoices, type CustomerInvoice } from "../lib/domain/billing";

const invoices: CustomerInvoice[] = [
  {
    id: "inv-1",
    reference: "INV-1",
    shipmentCode: "EXP-LUN10001",
    description: "Sea freight",
    shipmentLabel: "LUN100TH container",
    route: "China to Lusaka",
    status: "unpaid",
    amount: { amount: 405.9, currencyCode: "USD", formatted: "$405.90" },
    lineItems: [{ label: "Freight", amount: { amount: 405.9, currencyCode: "USD", formatted: "$405.90" } }],
  },
  {
    id: "inv-2",
    reference: "INV-2",
    shipmentCode: "LE1952-A",
    description: "Air freight",
    shipmentLabel: "Airport parcel",
    route: "Dubai to Lusaka",
    status: "paid",
    amount: { amount: 120, currencyCode: "USD", formatted: "$120.00" },
    lineItems: [{ label: "Freight", amount: { amount: 120, currencyCode: "USD", formatted: "$120.00" } }],
  },
];

describe("mobile billing domain", () => {
  it("totals outstanding invoices without converting their display currency", () => {
    expect(calculateCustomerOutstandingBalance(invoices)).toBe(405.9);
  });

  it("filters invoices by status and customer-recognizable shipment text", () => {
    expect(filterCustomerInvoices(invoices, "lun100th", "all")).toHaveLength(1);
    expect(filterCustomerInvoices(invoices, "lusaka", "paid")).toHaveLength(1);
    expect(filterCustomerInvoices(invoices, "EXP-LUN10001", "paid")).toHaveLength(0);
  });
});
