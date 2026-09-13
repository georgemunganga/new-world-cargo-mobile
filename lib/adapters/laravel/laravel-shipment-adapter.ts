import { apiClient } from "@/lib/api/client";
import type { CustomerShipment } from "@/lib/domain/shipment";
import type { ShipmentRepository } from "@/lib/repositories/types";

type LaravelShipment = {
  id: number | string;
  code?: string;
  reference?: string;
  title?: string;
  service?: CustomerShipment["service"];
  status?: CustomerShipment["status"];
  origin?: CustomerShipment["origin"];
  destination?: CustomerShipment["destination"];
  eta_label?: string;
  date_label?: string;
  branch_id?: number | string | null;
};

function mapShipment(item: LaravelShipment): CustomerShipment {
  return {
    id: String(item.id),
    code: item.code || item.reference || String(item.id),
    title: item.title || "Shipment",
    service: item.service || "import",
    status: item.status || "pending",
    origin: item.origin || { city: "Origin" },
    destination: item.destination || { city: "Destination" },
    etaLabel: item.eta_label,
    dateLabel: item.date_label,
    ...(item.branch_id ? { branchId: String(item.branch_id) } : {}),
  };
}

export const laravelShipmentRepository: ShipmentRepository = {
  async listShipments() {
    const response = await apiClient.get<{ data: LaravelShipment[] }>("/api/customer/shipments");
    return response.data.map(mapShipment);
  },
  async getShipment(id) {
    const response = await apiClient.get<{ data: LaravelShipment }>(`/api/customer/shipments/${encodeURIComponent(id)}`);
    return mapShipment(response.data);
  },
};
