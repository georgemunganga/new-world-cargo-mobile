import { shipments } from "@/lib/mock-cargo-data";
import type { ShipmentRepository } from "@/lib/repositories/types";
import type { CustomerShipment, ShipmentStatus } from "@/lib/domain/shipment";

const statusMap: Record<string, ShipmentStatus> = {
  action_required: "action_required",
  booking_confirmed: "booking_confirmed",
  in_transit: "in_transit",
  out_for_delivery: "out_for_delivery",
  delivered: "delivered",
  pending: "pending",
};

function toCustomerShipment(shipment: (typeof shipments)[number]): CustomerShipment {
  return {
    id: shipment.id,
    code: shipment.reference,
    title: shipment.title,
    service: shipment.service,
    status: statusMap[shipment.status] ?? "pending",
    origin: shipment.pickup,
    destination: shipment.destination,
    etaLabel: shipment.eta,
    dateLabel: shipment.dateLabel,
    actionLabel: shipment.actionLabel,
    trackingContact: shipment.trackingContact,
    trackingProgress: shipment.trackingProgress,
  };
}

export const mockShipmentRepository: ShipmentRepository = {
  async listShipments() {
    return shipments.map(toCustomerShipment);
  },
  async getShipment(id) {
    const shipment = shipments.find((item) => item.id === id || item.reference === id);
    return shipment ? toCustomerShipment(shipment) : null;
  },
};
