import { apiClient } from "@/lib/api/client";
import type { Pickup, PickupStatus } from "@/lib/domain/pickup";
import type { PickupRepository } from "@/lib/repositories/types";
import { missingPortalContract } from "./portal-contract-gap";

type LaravelPickupResponse = {
  id?: string | number;
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
    const response = await apiClient.get<{ data: LaravelPickupResponse | null }>("/api/v1/pickups/current");
    return response.data ? [mapPickup(response.data)] : [];
  },
  async reschedulePickup(shipmentId, slotId) {
    void shipmentId;
    void slotId;
    missingPortalContract("Pickup reschedule by shipment ID");
  },
  async cancelPickup(shipmentId) {
    void shipmentId;
    missingPortalContract("Pickup cancel by shipment ID");
  },
  async requestPickupHelp(shipmentId) {
    void shipmentId;
    missingPortalContract("Pickup help request");
  },
  async restorePickup(shipmentId) {
    void shipmentId;
    missingPortalContract("Pickup restore");
  },
};
