import { describe, expect, it } from "vitest";
import { buildReceiptDocument, receiptFilename } from "../lib/customer-document-export";
import { mockInvoices } from "../lib/mock-billing";

describe("customer receipt export", () => {
  it("creates a stable, customer-readable receipt filename", () => {
    expect(receiptFilename(mockInvoices[2])).toBe("new-worldcargo-receipt-inv-2608-003.html");
  });

  it("includes the invoice record and escaped charge content in the document", () => {
    const document = buildReceiptDocument({ ...mockInvoices[2], description: "Document <envelope>" });
    expect(document).toContain("INV-2608-003");
    expect(document).toContain("NWC-23411");
    expect(document).toContain("K 82.00");
    expect(document).toContain("Local delivery");
    expect(document).toContain("Payment receipt");
  });
});
