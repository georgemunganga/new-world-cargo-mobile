import { describe, expect, it } from "vitest";
import { mockPickups, mockPickupSlots, pickupSlotFor, pickupStatusLabel } from "../lib/mock-pickup-management";

describe("mock pickup management", () => {
  it("provides an eligible deterministic pickup and selectable windows", () => {
    expect(mockPickups[0].shipmentId).toBe("nwc-23990");
    expect(mockPickupSlots).toHaveLength(3);
    expect(pickupSlotFor("tomorrow-am").label).toContain("Tomorrow");
  });

  it("presents customer-facing pickup status labels", () => {
    expect(pickupStatusLabel("rescheduled")).toBe("Pickup rescheduled");
    expect(pickupStatusLabel("cancelled")).toBe("Pickup cancelled");
  });
});
