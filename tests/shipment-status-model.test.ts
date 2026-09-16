import { describe, expect, it } from "vitest";
import { isCancellableStatus, isTerminalStatus, statusPresentation } from "../lib/shipment-status-presentation";
import { isActiveShipment } from "../lib/shipment-navigation";
import type { ShipmentStatus } from "../lib/domain/shipment";

const shipment = (status: ShipmentStatus) =>
  ({ id: "s1", reference: "NWC-1", service: "local", status, title: "Parcel",
     pickup: { city: "Lusaka", area: "Roma", detail: "A" },
     destination: { city: "Lusaka", area: "Kabulonga", detail: "B" },
     eta: "Today", dateLabel: "Today" }) as never;

describe("shipment status model", () => {
  it("presents every status the portal contract can send", () => {
    const contractStatuses: ShipmentStatus[] = [
      "pending", "pickup_scheduled", "picked_up", "in_transit", "at_destination",
      "out_for_delivery", "delivered", "delayed", "failed", "cancelled",
    ];
    contractStatuses.forEach((status) => {
      expect(statusPresentation[status], `missing presentation for ${status}`).toBeDefined();
      expect(statusPresentation[status].label.length).toBeGreaterThan(0);
    });
  });

  it("treats cancelled and failed as finished, not as live deliveries", () => {
    expect(isTerminalStatus("cancelled")).toBe(true);
    expect(isTerminalStatus("failed")).toBe(true);
    expect(isTerminalStatus("delivered")).toBe(true);
    // A cancelled shipment must not become the Home hero or open live tracking.
    expect(isActiveShipment(shipment("cancelled"))).toBe(false);
    expect(isActiveShipment(shipment("failed"))).toBe(false);
    expect(isActiveShipment(shipment("in_transit"))).toBe(true);
  });

  it("does not offer cancellation once the cargo is moving or already closed", () => {
    expect(isCancellableStatus("pending")).toBe(true);
    expect(isCancellableStatus("pickup_scheduled")).toBe(true);
    expect(isCancellableStatus("cancelled")).toBe(false);
    expect(isCancellableStatus("in_transit")).toBe(false);
    expect(isCancellableStatus("delivered")).toBe(false);
  });

  it("keeps distinct operational states distinct", () => {
    const labels = (["pickup_scheduled", "picked_up", "delayed", "cancelled"] as ShipmentStatus[])
      .map((status) => statusPresentation[status].label);
    expect(new Set(labels).size).toBe(labels.length);
    expect(labels).not.toContain("Pending");
  });
});
