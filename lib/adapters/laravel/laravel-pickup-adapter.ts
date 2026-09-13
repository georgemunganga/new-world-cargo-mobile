import { apiClient } from "@/lib/api/client";
import type { Pickup, PickupStatus } from "@/lib/domain/pickup";
import type { PickupRepository } from "@/lib/repositories/types";

type LaravelPickupResponse = {
  shipmentId?: string;
  shipment_id?: string | number;
  shipmentReference?: string;
  shipment_reference?: string;
  location?: string;
  collectionPoint?: string;
  collection_point?: string;
  scheduledSlotId?: string;
  scheduled_slot_id?: string;
  status?: PickupStatus;
};

function mapPickup(raw: LaravelPickupResponse): Pickup {
  return {
    shipmentId: String(raw.shipmentId ?? raw.shipment_id ?? ""),
    shipmentReference: raw.shipmentReference ?? raw.shipment_reference ?? "Shipment",
    location: raw.location ?? "Pickup location to confirm",
    collectionPoint: raw.collectionPoint ?? raw.collection_point ?? "Collection point to confirm",
    scheduledSlotId: raw.scheduledSlotId ?? raw.scheduled_slot_id ?? "today-pm",
    status: raw.status ?? "scheduled",
  };
}

export const laravelPickupRepository: PickupRepository = {
  async listPickups() {
    const response = await apiClient.get<{ data: LaravelPickupResponse[] }>("/api/customer/pickups");
    return response.data.map(mapPickup);
  },
  async reschedulePickup(shipmentId, slotId) {
    const response = await apiClient.patch<{ data: LaravelPickupResponse }>(`/api/customer/pickups/${encodeURIComponent(shipmentId)}/reschedule`, { slot_id: slotId });
    return mapPickup(response.data);
  },
  async cancelPickup(shipmentId) {
    const response = await apiClient.patch<{ data: LaravelPickupResponse }>(`/api/customer/pickups/${encodeURIComponent(shipmentId)}/cancel`);
    return mapPickup(response.data);
  },
  async requestPickupHelp(shipmentId) {
    const response = await apiClient.patch<{ data: LaravelPickupResponse }>(`/api/customer/pickups/${encodeURIComponent(shipmentId)}/help`);
    return mapPickup(response.data);
  },
  async restorePickup(shipmentId) {
    const response = await apiClient.patch<{ data: LaravelPickupResponse }>(`/api/customer/pickups/${encodeURIComponent(shipmentId)}/restore`);
    return mapPickup(response.data);
  },
};
