import { describe, expect, it } from "vitest";
import { shipments } from "../lib/mock-cargo-data";
import { firstActiveShipment, isActiveShipment, shipmentDestination } from "../lib/shipment-navigation";

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

  it("does not treat delivered-only history as an active Home shipment", () => {
    const deliveredOnly = shipments.filter((shipment) => shipment.status === "delivered");
    expect(deliveredOnly.length).toBeGreaterThan(0);
    expect(firstActiveShipment(deliveredOnly)).toBeUndefined();
  });
});
