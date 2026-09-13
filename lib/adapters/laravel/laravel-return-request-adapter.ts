import { apiClient } from "@/lib/api/client";
import type { ReturnHandover, ReturnReason, ReturnRequest, ReturnRequestStatus } from "@/lib/domain/return-request";
import type { ReturnRequestRepository } from "@/lib/repositories/types";

type LaravelReturnRequestResponse = {
  id?: string | number;
  shipmentId?: string;
  shipment_id?: string | number;
  shipmentReference?: string;
  shipment_reference?: string;
  trackingNumber?: string | null;
  reason?: ReturnReason;
  handover?: ReturnHandover | "pickup" | "drop_off";
  status?: ReturnRequestStatus | "requested" | "cancelled" | "in_transit";
  displayStatus?: string;
  createdLabel?: string;
  created_label?: string;
  created_at?: string;
};

function mapHandover(value?: LaravelReturnRequestResponse["handover"]): ReturnHandover {
  return value === "pickup" || value === "courier-pickup" ? "courier-pickup" : "collection-point";
}

function mapStatus(value?: LaravelReturnRequestResponse["status"]): ReturnRequestStatus {
  if (value === "approved" || value === "in_transit") return "approved";
  if (value === "reviewing") return "reviewing";
  return "submitted";
}

function mapReturnRequest(raw: LaravelReturnRequestResponse): ReturnRequest {
  return {
    id: String(raw.id ?? raw.shipment_id ?? raw.shipmentId ?? ""),
    shipmentId: String(raw.shipmentId ?? raw.shipment_id ?? ""),
    shipmentReference: raw.shipmentReference ?? raw.shipment_reference ?? raw.trackingNumber ?? "Shipment",
    reason: raw.reason ?? "other",
    handover: mapHandover(raw.handover),
    status: mapStatus(raw.status),
    createdLabel: raw.createdLabel ?? raw.created_label ?? raw.created_at ?? "Recently",
  };
}

export const laravelReturnRequestRepository: ReturnRequestRepository = {
  async listRequests() {
    const response = await apiClient.get<{ data: LaravelReturnRequestResponse[] }>("/api/v1/returns");
    return response.data.map(mapReturnRequest);
  },
  async submitReturn(input) {
    const response = await apiClient.post<{ data: LaravelReturnRequestResponse }>("/api/v1/returns", {
      shipmentId: Number(input.shipment.id),
      reason: input.reason,
      handover: input.handover === "courier-pickup" ? "pickup" : "drop_off",
    });
    return mapReturnRequest(response.data);
  },
};
