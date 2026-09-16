import { isTerminalStatus } from "@/lib/shipment-status-presentation";
import type { Shipment } from "@/types/cargo";

/**
 * Active means still moving. Cancelled and failed shipments are finished, so
 * they must not surface as the Home hero, sit under the Active filter, or be
 * redirected into live tracking.
 */
export function isActiveShipment(shipment: Shipment) {
  return !isTerminalStatus(shipment.status);
}

export function firstActiveShipment(shipments: Shipment[]) {
  return shipments.find(isActiveShipment);
}

export function shipmentDestination(shipment: Shipment) {
  return isActiveShipment(shipment) ? `/tracking/${shipment.id}` : `/shipments/${shipment.id}`;
}
