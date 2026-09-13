import { apiClient } from "@/lib/api/client";
import type { ReturnHandover, ReturnReason, ReturnRequest, ReturnRequestStatus } from "@/lib/domain/return-request";
import type { ReturnRequestRepository } from "@/lib/repositories/types";

type LaravelReturnRequestResponse = {
  id?: string | number;
  shipmentId?: string;
  shipment_id?: string | number;
  shipmentReference?: string;
  shipment_reference?: string;
  reason?: ReturnReason;
  handover?: ReturnHandover;
  status?: ReturnRequestStatus;
  createdLabel?: string;
  created_label?: string;
  created_at?: string;
};

function mapReturnRequest(raw: LaravelReturnRequestResponse): ReturnRequest {
  return {
    id: String(raw.id ?? raw.shipment_id ?? raw.shipmentId ?? ""),
    shipmentId: String(raw.shipmentId ?? raw.shipment_id ?? ""),
    shipmentReference: raw.shipmentReference ?? raw.shipment_reference ?? "Shipment",
    reason: raw.reason ?? "other",
    handover: raw.handover ?? "collection-point",
    status: raw.status ?? "submitted",
    createdLabel: raw.createdLabel ?? raw.created_label ?? raw.created_at ?? "Recently",
  };
}

export const laravelReturnRequestRepository: ReturnRequestRepository = {
  async listRequests() {
    const response = await apiClient.get<{ data: LaravelReturnRequestResponse[] }>("/api/customer/returns");
    return response.data.map(mapReturnRequest);
  },
  async submitReturn(input) {
    const response = await apiClient.post<{ data: LaravelReturnRequestResponse }>("/api/customer/returns", {
      shipment_id: input.shipment.id,
      shipment_reference: input.shipment.reference,
      reason: input.reason,
      handover: input.handover,
    });
    return mapReturnRequest(response.data);
  },
};
