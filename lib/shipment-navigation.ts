import type { Shipment } from "@/types/cargo";

export function isActiveShipment(shipment: Shipment) {
  return shipment.status !== "delivered";
}

export function firstActiveShipment(shipments: Shipment[]) {
  return shipments.find(isActiveShipment);
}

export function shipmentDestination(shipment: Shipment) {
  return isActiveShipment(shipment) ? `/tracking/${shipment.id}` : `/shipments/${shipment.id}`;
}
