import { describe, expect, it } from "vitest";
import { mockPickupRepository } from "../lib/adapters/mock/mock-pickup-adapter";
import { pickupSlotFor, pickupStatusLabel, reschedulePickupSlot, updatePickupStatus } from "../lib/domain/pickup";

const pickup = {
  shipmentId: "shipment-1",
  shipmentReference: "EXP-LUN10001",
  location: "Supplier handover",
  collectionPoint: "Dubai",
  scheduledSlotId: "today-pm",
  status: "scheduled" as const,
};

describe("mobile pickup repository", () => {
  it("keeps pickup status and slot presentation in the domain layer", () => {
    expect(pickupStatusLabel("needs-support")).toBe("Pickup assistance");
    expect(pickupSlotFor("tomorrow-am").label).toContain("Tomorrow");
  });

  it("updates pickup status and selected slot deterministically", () => {
    expect(updatePickupStatus(pickup, "cancelled").status).toBe("cancelled");
    expect(reschedulePickupSlot(pickup, "tomorrow-pm")).toMatchObject({ scheduledSlotId: "tomorrow-pm", status: "rescheduled" });
  });

  it("reschedules and cancels existing pickups through the repository", async () => {
    const existing = (await mockPickupRepository.listPickups())[0];
    const rescheduled = await mockPickupRepository.reschedulePickup(existing.shipmentId, "tomorrow-am");
    const cancelled = await mockPickupRepository.cancelPickup(existing.shipmentId);

    expect(rescheduled?.scheduledSlotId).toBe("tomorrow-am");
    expect(cancelled?.status).toBe("cancelled");
  });
});
