import type { CustomerShipment } from "@/lib/domain/shipment";
import type { Address, ServiceType, Shipment, ShipmentStatus } from "@/types/cargo";

const serviceMap: Record<CustomerShipment["service"], ServiceType> = {
  import: "import",
  intercity: "intercity",
  local: "local",
  custom: "local",
};

const statusMap: Record<CustomerShipment["status"], ShipmentStatus> = {
  action_required: "action_required",
  booking_confirmed: "booking_confirmed",
  in_transit: "in_transit",
  out_for_delivery: "out_for_delivery",
  delivered: "delivered",
  pending: "pending",
  cancelled: "pending",
  exception: "action_required",
};

function toUiAddress(address: CustomerShipment["origin"]): Address {
  return {
    label: address.label,
    city: address.city,
    area: address.area || address.city,
    detail: address.detail || address.area || address.city,
  };
}

export function toUiShipment(shipment: CustomerShipment): Shipment {
  return {
    id: shipment.id,
    reference: shipment.code,
    service: serviceMap[shipment.service],
    status: statusMap[shipment.status],
    title: shipment.title,
    pickup: toUiAddress(shipment.origin),
    destination: toUiAddress(shipment.destination),
    eta: shipment.etaLabel || shipment.dateLabel || "To be confirmed",
    dateLabel: shipment.dateLabel || shipment.etaLabel || "Pending",
    actionLabel: shipment.actionLabel,
    trackingContact: shipment.trackingContact,
    trackingProgress: shipment.trackingProgress,
  };
}

export function toUiShipments(shipments: CustomerShipment[]) {
  return shipments.map(toUiShipment);
}
