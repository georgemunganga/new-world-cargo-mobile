import { apiClient } from "@/lib/api/client";
import type { ShipmentRepository } from "@/lib/repositories/types";
import { mapPortalShipment } from "./portal-shipment-contract";
import type { PortalShipment } from "./portal-shipment-contract";

export const laravelShipmentRepository: ShipmentRepository = {
  async listShipments() {
    const response = await apiClient.get<{ data: PortalShipment[] }>("/api/v1/shipments");
    return response.data.map(mapPortalShipment);
  },
  async performAction(id, action) {
    const response = await apiClient.post<{ data: PortalShipment }>(
      `/api/v1/shipments/${encodeURIComponent(id)}/actions`,
      { action },
    );
    return mapPortalShipment(response.data);
  },
  async getShipment(id) {
    const response = await apiClient.get<{ data: PortalShipment }>(`/api/v1/shipments/${encodeURIComponent(id)}`);
    return mapPortalShipment(response.data);
  },
};
