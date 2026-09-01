import { describe, expect, it } from "vitest";

import { createMockReturnRequest, isReturnEligible } from "../lib/mock-returns";
import { shipments } from "../lib/mock-cargo-data";

describe("mock return requests", () => {
  it("allows a return only after delivery", () => {
    expect(isReturnEligible(shipments[1])).toBe(true);
    expect(isReturnEligible(shipments[0])).toBe(false);
  });

  it("creates a submitted request connected to the delivered shipment", () => {
    const request = createMockReturnRequest(shipments[1], "damaged", "courier-pickup");
    expect(request).toMatchObject({ shipmentId: shipments[1].id, shipmentReference: shipments[1].reference, status: "submitted" });
  });
});
