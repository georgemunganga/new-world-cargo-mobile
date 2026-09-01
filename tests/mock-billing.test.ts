import { describe, expect, it } from "vitest";
import { calculateOutstandingBalance, canPayWithMockWallet, filterMockInvoices, mockInvoices, mockReminderLabel, paymentMethodLabel } from "../lib/mock-billing";

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

  it("only allows a Cargo Wallet payment when the balance covers the selected invoice", () => {
    expect(canPayWithMockWallet(1500, mockInvoices[0])).toBe(true);
    expect(canPayWithMockWallet(200, mockInvoices[0])).toBe(false);
  });

  it("provides deterministic due-date reminder language for unpaid invoices", () => {
    expect(mockReminderLabel(mockInvoices[1])).toBe("Due today");
    expect(mockReminderLabel(mockInvoices[2])).toBeUndefined();
  });
});
