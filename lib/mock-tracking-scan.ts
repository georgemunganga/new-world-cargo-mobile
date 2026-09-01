import type { Shipment } from "@/types/cargo";

export function normaliseTrackingCode(value: string) { return value.trim().toUpperCase().replace(/\s+/g, ""); }

export function findShipmentForTrackingCode(value: string, shipments: Shipment[]) {
  const code = normaliseTrackingCode(value);
  return shipments.find((shipment) => normaliseTrackingCode(shipment.reference) === code || normaliseTrackingCode(shipment.id) === code);
}
