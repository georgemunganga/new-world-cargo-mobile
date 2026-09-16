import { shipments } from "@/lib/mock-cargo-data";
import type { ShipmentRepository } from "@/lib/repositories/types";
import type { CustomerShipment, ShipmentStatus } from "@/lib/domain/shipment";
import type { BookingService, BookingSubmissionResult } from "@/lib/domain/booking";
import type { Address, ImportBookingDraft, IntercityBookingDraft, LocalDeliveryDraft } from "@/types/cargo";

const submittedShipments: CustomerShipment[] = [];

const statusMap: Record<string, ShipmentStatus> = {
  pending: "pending",
  pickup_scheduled: "pickup_scheduled",
  in_transit: "in_transit",
  out_for_delivery: "out_for_delivery",
  delivered: "delivered",
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

function addressOrFallback(address: Partial<Address> | undefined, fallback: CustomerShipment["origin"]): CustomerShipment["origin"] {
  return {
    city: address?.city || fallback.city,
    area: address?.area || fallback.area,
    detail: address?.detail || fallback.detail,
    label: address?.label,
  };
}

function titleFor(service: BookingService, draft: unknown) {
  const cargoItems = (draft as { cargoItems?: Array<{ name?: string }> }).cargoItems;
  const firstItem = cargoItems?.find((item) => item.name?.trim())?.name?.trim();
  if (firstItem) return firstItem;
  if (service === "local") return "Local delivery request";
  if (service === "intercity") return "City-to-city cargo";
  if (service === "import") return "International cargo request";
  return "Custom cargo request";
}

export function recordMockSubmittedBooking(result: BookingSubmissionResult, draft: unknown) {
  const service = result.service;
  const localDraft = draft as Partial<LocalDeliveryDraft>;
  const intercityDraft = draft as Partial<IntercityBookingDraft>;
  const importDraft = draft as Partial<ImportBookingDraft>;
  const origin =
    service === "import"
      ? { city: importDraft.originCountry || "Origin", area: importDraft.originCity || "International office", detail: "Awaiting intake confirmation" }
      : service === "intercity"
        ? { city: intercityDraft.originCity || "Origin city", area: "New WorldCargo branch", detail: "Awaiting branch confirmation" }
        : addressOrFallback(localDraft.pickup, { city: "Lusaka", area: "Pickup", detail: "Awaiting pickup confirmation" });
  const destination =
    service === "import"
      ? { city: "Zambia", area: importDraft.destinationCity || "Lusaka", detail: "New WorldCargo destination branch" }
      : service === "intercity"
        ? { city: intercityDraft.destinationCity || "Destination city", area: "New WorldCargo branch", detail: "Awaiting destination confirmation" }
        : addressOrFallback(localDraft.destination, { city: "Lusaka", area: "Destination", detail: "Awaiting delivery confirmation" });

  submittedShipments.unshift({
    id: result.id,
    code: result.reference,
    title: titleFor(service, draft),
    service,
    status: result.status === "confirmed" ? "pickup_scheduled" : "pending",
    origin,
    destination,
    etaLabel: result.service === "local" ? "Pending confirmation" : "Quote pending",
    dateLabel: result.service === "local" ? "Request received" : "Awaiting quote",
    actionLabel: "View shipment",
    trackingProgress: {
      distanceLabel: result.service === "local" ? "Pickup confirmation pending" : "Quote confirmation pending",
      pickupTime: "Awaiting",
      arrivalTime: "To confirm",
      fraction: 0.1,
      mapLabel: `${origin.area || origin.city} to ${destination.area || destination.city}`,
      stages: ["Request received", "Confirmation pending", "Cargo movement", "Delivery"],
    },
  });
}

export const mockShipmentRepository: ShipmentRepository = {
  async listShipments() {
    return [...submittedShipments, ...shipments.map(toCustomerShipment)];
  },
  async performAction(id, action) {
    const shipment = shipments.find((item) => item.id === id);
    if (!shipment) throw new Error("Shipment not found.");
    if (action === "cancel") shipment.status = "cancelled" as typeof shipment.status;
    const mapped = await mockShipmentRepository.getShipment(id);
    if (!mapped) throw new Error("Shipment not found.");
    return mapped;
  },
  async getShipment(id) {
    const submitted = submittedShipments.find((item) => item.id === id || item.code === id);
    if (submitted) return submitted;
    const shipment = shipments.find((item) => item.id === id || item.reference === id);
    return shipment ? toCustomerShipment(shipment) : null;
  },
};
