import { apiClient } from "@/lib/api/client";
import { MobileApiError } from "@/lib/api/errors";
import type { CustomerShipment } from "@/lib/domain/shipment";
import type { TrackingEvent, TrackingResult } from "@/lib/domain/tracking";
import type { TrackingRepository } from "@/lib/repositories/types";
import { mapPortalShipment } from "./portal-shipment-contract";
import type { PortalShipment } from "./portal-shipment-contract";

type PortalTrackingEvent = {
  id?: string;
  label?: string;
  detail?: string;
  occurredAt?: string | null;
  displayTime?: string | null;
  complete?: boolean;
  completed?: boolean;
};

type PortalTrackingShipment = PortalShipment & {
  events?: PortalTrackingEvent[];
};

function mapEvent(event: PortalTrackingEvent, index: number): TrackingEvent {
  return {
    id: event.id ?? `event-${index + 1}`,
    label: event.label ?? "Tracking update",
    ...(event.detail ? { detail: event.detail } : {}),
    ...(event.occurredAt ? { happenedAt: event.occurredAt } : {}),
    completed: event.completed ?? event.complete ?? false,
  };
}

function mapTracking(response: { data: PortalTrackingShipment }): TrackingResult {
  return {
    kind: "found",
    shipment: mapPortalShipment(response.data),
    events: (response.data.events ?? []).map(mapEvent),
  };
}

export const laravelTrackingRepository: TrackingRepository = {
  async trackByCode(code) {
    try {
      const response = await apiClient.get<{ data: PortalTrackingShipment }>(`/api/v1/public/tracking/${encodeURIComponent(code)}`, { auth: false });
      return mapTracking(response);
    } catch (error) {
      if (error instanceof MobileApiError && error.code === "NOT_FOUND") {
        return { kind: "not-found", message: "We could not find that tracking number. Check it and try again." };
      }
      return { kind: "unavailable", message: "Tracking is temporarily unavailable. Please try again.", retryable: true };
    }
  },
};

export function trackingShipmentFallback(code: string): CustomerShipment {
  return {
    id: code,
    code,
    title: "Shipment",
    service: "import",
    status: "pending",
    origin: { city: "Origin" },
    destination: { city: "Destination" },
  };
}
