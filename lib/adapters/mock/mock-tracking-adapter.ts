import { shipments } from "@/lib/mock-cargo-data";
import { findShipmentForTrackingCode } from "@/lib/mock-tracking-scan";
import type { TrackingRepository } from "@/lib/repositories/types";
import { mockShipmentRepository } from "./mock-shipment-adapter";

export const mockTrackingRepository: TrackingRepository = {
  async trackByCode(code) {
    const normalized = code.trim();
    if (!normalized) return { kind: "not-found", message: "Enter a tracking number to continue." };
    if (normalized.toUpperCase() === "NWC-OFFLINE") return { kind: "unavailable", message: "Tracking is temporarily unavailable. Please try again.", retryable: true };

    const shipment = findShipmentForTrackingCode(normalized, shipments);
    if (!shipment) return { kind: "not-found", message: "Shipment not found. Check the code and try again." };

    const mobileShipment = await mockShipmentRepository.getShipment(shipment.id);
    if (!mobileShipment) return { kind: "not-found", message: "Shipment not found. Check the code and try again." };

    return {
      kind: "found",
      shipment: mobileShipment,
      events: (shipment.trackingProgress?.stages ?? [shipment.dateLabel]).map((stage, index, all) => ({
        id: `${shipment.id}-event-${index}`,
        label: stage,
        completed: index / Math.max(all.length - 1, 1) <= (shipment.trackingProgress?.fraction ?? 1),
      })),
    };
  },
};
