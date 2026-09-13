import { apiClient } from "@/lib/api/client";
import type { BookingDraftSummary, BookingSubmissionResult } from "@/lib/domain/booking";
import type { BookingRepository } from "@/lib/repositories/types";
import { mapPortalShipment } from "./portal-shipment-contract";
import type { PortalShipment } from "./portal-shipment-contract";

type LaravelDraftResponse = {
  id: string | number;
  status?: string;
  payload?: { service?: BookingDraftSummary["service"]; title?: string; progressLabel?: string; form?: Record<string, unknown> };
  updatedAt?: string;
  createdAt?: string;
  revision?: number;
};

function mapDraft(raw: LaravelDraftResponse): BookingDraftSummary {
  const service = raw.payload?.service ?? "custom";
  return {
    id: String(raw.id),
    service,
    title: raw.payload?.title ?? `${service[0].toUpperCase()}${service.slice(1)} shipment draft`,
    progressLabel: raw.payload?.progressLabel ?? (raw.status === "quoted" ? "Quote ready" : "Draft in progress"),
    updatedAt: raw.updatedAt ?? raw.createdAt ?? "Recently",
  };
}

export const laravelBookingRepository: BookingRepository = {
  async listDrafts() {
    const response = await apiClient.get<{ data: LaravelDraftResponse[] }>("/api/v1/shipment-drafts");
    return response.data.map(mapDraft);
  },
  async deleteDraft(id) {
    await apiClient.delete(`/api/v1/shipment-drafts/${encodeURIComponent(id)}`);
  },
  async submitBooking(input) {
    const draft = await apiClient.post<{ data: LaravelDraftResponse }>("/api/v1/shipment-drafts", {
      payload: {
        service: input.service,
        draft: input.draft,
        form: input.draft,
      },
    });
    const response = await apiClient.post<{ data: PortalShipment }>(`/api/v1/shipment-drafts/${encodeURIComponent(String(draft.data.id))}/submit`, {});
    const shipment = mapPortalShipment(response.data);
    return {
      id: shipment.id,
      reference: shipment.code,
      service: input.service,
      status: "received",
      message: "Your shipment request has been received by New WorldCargo.",
    };
  },
};
