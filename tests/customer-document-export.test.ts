import { describe, expect, it } from "vitest";
import { buildProofOfDeliveryDocument, buildReceiptDocument, proofOfDeliveryFilename, receiptFilename } from "../lib/customer-document-export";
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

  it("creates an exportable proof record for a delivered shipment", () => {
    const shipment = { id: "nwc-23411", reference: "NWC-23411", service: "local" as const, status: "delivered" as const, title: "Document envelope", pickup: { city: "Lusaka", area: "Woodlands", detail: "Sender address" }, destination: { city: "Lusaka", area: "Rhodes Park", detail: "Receiver address" }, eta: "Delivered 18 Aug", dateLabel: "Delivered" };
    expect(proofOfDeliveryFilename(shipment)).toBe("new-worldcargo-proof-nwc-23411.html");
    expect(buildProofOfDeliveryDocument(shipment)).toContain("Proof of delivery");
    expect(buildProofOfDeliveryDocument(shipment)).toContain("M. Banda");
  });
});
