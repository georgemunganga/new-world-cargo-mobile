import { describe, expect, it } from "vitest";
import { calculateOutstandingBalance, filterMockInvoices, mockInvoices, paymentMethodLabel } from "../lib/mock-billing";

describe("mock billing ledger", () => {
  it("totals only unpaid invoices for the customer billing summary", () => {
    expect(calculateOutstandingBalance(mockInvoices)).toBe(3730);
  });

  it("filters a ledger by status and invoice or shipment search", () => {
    expect(filterMockInvoices(mockInvoices, "NWC-23990", "unpaid")).toHaveLength(1);
    expect(filterMockInvoices(mockInvoices, "", "paid")).toHaveLength(2);
    expect(filterMockInvoices(mockInvoices, "not found", "all")).toHaveLength(0);
  });

  it("uses customer-recognizable labels for mock payment choices", () => {
    expect(paymentMethodLabel("wallet")).toBe("Cargo wallet");
  });
});
