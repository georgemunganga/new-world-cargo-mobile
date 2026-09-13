import { apiClient } from "@/lib/api/client";
import type { SupportCase, SupportCaseStatus } from "@/lib/domain/support";
import type { SupportRepository } from "@/lib/repositories/types";

type LaravelSupportEventResponse = {
  label?: string;
  title?: string;
  detail?: string;
  message?: string;
  time?: string;
  created_at?: string;
};

type LaravelSupportCaseResponse = {
  id?: string | number;
  title?: string;
  topic?: string;
  detail?: string;
  message?: string;
  status?: string;
  updatedAt?: string;
  updated_at?: string;
  events?: LaravelSupportEventResponse[];
  timeline?: LaravelSupportEventResponse[];
};

function normalizeStatus(status?: string): SupportCaseStatus {
  if (status === "resolved" || status === "closed") return "resolved";
  if (status === "waiting" || status === "pending") return "waiting";
  return "open";
}

function mapSupportCase(raw: LaravelSupportCaseResponse): SupportCase {
  const events = raw.events ?? raw.timeline ?? [];
  return {
    id: String(raw.id ?? raw.title ?? raw.topic ?? ""),
    title: raw.title ?? raw.topic ?? "Support request",
    detail: raw.detail ?? raw.message ?? "New WorldCargo support request",
    status: normalizeStatus(raw.status),
    updatedAt: raw.updatedAt ?? raw.updated_at ?? "Recently",
    events: events.map((event) => ({
      label: event.label ?? event.title ?? "Support update",
      detail: event.detail ?? event.message ?? "Update received.",
      time: event.time ?? event.created_at ?? "Recently",
    })),
  };
}

export const laravelSupportRepository: SupportRepository = {
  async listCases() {
    const response = await apiClient.get<{ data: LaravelSupportCaseResponse[] }>("/api/customer/support/cases");
    return response.data.map(mapSupportCase);
  },
  async createCase(input) {
    const response = await apiClient.post<{ data: LaravelSupportCaseResponse }>("/api/customer/support/cases", {
      topic: input.topic,
      detail: input.detail,
      shipment_reference: input.shipmentReference,
      invoice_reference: input.invoiceReference,
    });
    return mapSupportCase(response.data);
  },
};
