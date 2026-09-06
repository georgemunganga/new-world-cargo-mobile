import { describe, expect, it } from "vitest";
import { blankCargoItem, cargoItemsSummary, hasCompleteCargoItems, nextMockAttachment, supportingDocumentCopy } from "../lib/booking-cargo";

describe("booking cargo workflow", () => {
  it("requires a non-empty cargo name and positive quantity", () => {
    expect(hasCompleteCargoItems([blankCargoItem()])).toBe(false);
    expect(hasCompleteCargoItems([{ id: "chair", name: "Chairs", quantity: 1 }])).toBe(true);
    expect(hasCompleteCargoItems([{ id: "zero", name: "Chairs", quantity: 0 }])).toBe(false);
  });

  it("summarizes multiple named cargo items for booking review", () => {
    expect(cargoItemsSummary([{ id: "one", name: "Chairs", quantity: 2 }, { id: "two", name: "Lamp", quantity: 1 }])).toBe("Chairs × 2, Lamp × 1");
  });

  it("uses an import-specific delivery-note label and general supporting proof elsewhere", () => {
    expect(supportingDocumentCopy("import").label).toContain("delivery note");
    expect(supportingDocumentCopy("local").label).toContain("receipt");
    expect(nextMockAttachment("photo", 2).name).toBe("Cargo photo 2");
  });
});
