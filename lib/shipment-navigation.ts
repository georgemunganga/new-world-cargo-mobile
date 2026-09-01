import type { Shipment } from "@/types/cargo";

export function isActiveShipment(shipment: Shipment) {
  return shipment.status !== "delivered";
}

export function shipmentDestination(shipment: Shipment) {
  return isActiveShipment(shipment) ? `/tracking/${shipment.id}` : `/shipments/${shipment.id}`;
}
