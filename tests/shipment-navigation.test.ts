import { describe, expect, it } from "vitest";
import { shipments } from "../lib/mock-cargo-data";
import { isActiveShipment, shipmentDestination } from "../lib/shipment-navigation";

describe("shipment destination routing", () => {
  it("opens a moving shipment in Live Shipment Tracking", () => {
    const active = shipments.find((shipment) => shipment.status === "in_transit")!;
    expect(isActiveShipment(active)).toBe(true);
    expect(shipmentDestination(active)).toBe(`/tracking/${active.id}`);
  });

  it("opens a delivered shipment in its delivery summary", () => {
    const delivered = shipments.find((shipment) => shipment.status === "delivered")!;
    expect(isActiveShipment(delivered)).toBe(false);
    expect(shipmentDestination(delivered)).toBe(`/shipments/${delivered.id}`);
  });
});
