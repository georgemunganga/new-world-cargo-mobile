import { describe, expect, it } from "vitest";
import { isImportReady, isIntercityReady } from "../lib/service-booking";

describe("service-specific booking readiness", () => {
  it("requires a freight method and core import route, cargo, and consignee information", () => {
    const draft = { service: "import" as const, method: "air" as const, originCountry: "China", originCity: "Guangzhou", destinationCity: "Lusaka", cargoCategory: "general", consignee: { name: "Chanda Mwila", phone: "+260971000000" } };
    expect(isImportReady(draft)).toBe(true);
    expect(isImportReady({ ...draft, method: undefined })).toBe(false);
    expect(isImportReady({ ...draft, consignee: { name: "", phone: "+260971000000" } })).toBe(false);
  });

  it("requires a city route, cargo, contacts, and fulfilment method for City-to-City", () => {
    const draft = { service: "intercity" as const, originCity: "Lusaka", destinationCity: "Kitwe", cargoCategory: "cartons", sender: { name: "Chanda", phone: "+260971000000" }, receiver: { name: "Mwila", phone: "+260977000000" }, fulfilment: "collection" as const };
    expect(isIntercityReady(draft)).toBe(true);
    expect(isIntercityReady({ ...draft, receiver: { name: "Mwila", phone: "" } })).toBe(false);
    expect(isIntercityReady({ ...draft, fulfilment: undefined })).toBe(false);
  });
});
