import { apiClient } from "@/lib/api/client";
import type { CustomerShipment } from "@/lib/domain/shipment";
import type { TrackingResult } from "@/lib/domain/tracking";
import type { TrackingRepository } from "@/lib/repositories/types";

export const laravelTrackingRepository: TrackingRepository = {
  async trackByCode(code) {
    const response = await apiClient.get<TrackingResult | { data: TrackingResult }>(`/api/customer/tracking/${encodeURIComponent(code)}`, { auth: false });
    return "data" in response ? response.data : response;
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
