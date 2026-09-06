import { describe, expect, it } from "vitest";
import { isLegalDocumentId, legalDocuments } from "../lib/legal-documents";

describe("legal documents", () => {
  it("keeps all customer policy destinations populated with review treatment", () => {
    expect(Object.keys(legalDocuments)).toEqual(["terms", "privacy", "payments"]);
    Object.values(legalDocuments).forEach((document) => {
      expect(document.effectiveDate).toContain("Legal approval required");
      expect(document.sections.length).toBeGreaterThan(3);
    });
  });

  it("only accepts known legal document route ids", () => {
    expect(isLegalDocumentId("terms")).toBe(true);
    expect(isLegalDocumentId("privacy")).toBe(true);
    expect(isLegalDocumentId("payments")).toBe(true);
    expect(isLegalDocumentId("about")).toBe(false);
  });
});
