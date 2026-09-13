import type { Shipment } from "@/types/cargo";
import { normaliseTrackingCode } from "@/lib/domain/tracking";

export { normaliseTrackingCode };

export function findShipmentForTrackingCode(value: string, shipments: Shipment[]) {
  const code = normaliseTrackingCode(value);
  return shipments.find((shipment) => normaliseTrackingCode(shipment.reference) === code || normaliseTrackingCode(shipment.id) === code);
}
