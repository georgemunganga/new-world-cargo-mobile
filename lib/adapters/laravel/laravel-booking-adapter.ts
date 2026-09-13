import { apiClient } from "@/lib/api/client";
import type { BookingDraftSummary, BookingSubmissionResult } from "@/lib/domain/booking";
import type { BookingRepository } from "@/lib/repositories/types";
import type { Address, BookingCargoAttachment, BookingCargoItem, PersonContact } from "@/types/cargo";
import { laravelUploadRepository } from "./laravel-upload-adapter";
import { mapPortalShipment } from "./portal-shipment-contract";
import type { PortalShipment } from "./portal-shipment-contract";

type LaravelDraftResponse = {
  id: string | number;
  status?: string;
  payload?: { service?: BookingDraftSummary["service"]; title?: string; progressLabel?: string; form?: Record<string, unknown>; draft?: unknown; cargoRows?: unknown[] };
  updatedAt?: string;
  createdAt?: string;
  revision?: number;
};

function mapDraft(raw: LaravelDraftResponse): BookingDraftSummary {
  const service = raw.payload?.service ?? "custom";
  const form = raw.payload?.form ?? {};
  const route = [form.pickup, form.destination].filter(Boolean).join(" → ");
  return {
    id: String(raw.id),
    service,
    title: raw.payload?.title ?? (route || `${service[0].toUpperCase()}${service.slice(1)} shipment draft`),
    progressLabel: raw.payload?.progressLabel ?? (raw.status === "quoted" ? "Quote ready" : "Draft in progress"),
    updatedAt: raw.updatedAt ?? raw.createdAt ?? "Recently",
    payload: raw.payload,
  };
}

function isAttachment(value: unknown): value is BookingCargoAttachment {
  return Boolean(value && typeof value === "object" && "kind" in value && "name" in value);
}

async function uploadAttachment(attachment: BookingCargoAttachment): Promise<BookingCargoAttachment & { fileId?: string; url?: string; contentType?: string }> {
  if (!attachment.uri || attachment.id.startsWith("uploaded-")) return attachment;
  const uploaded = await laravelUploadRepository.uploadFile({
    uri: attachment.uri,
    name: attachment.name,
    type: attachment.type ?? (attachment.kind === "photo" ? "image/jpeg" : "application/octet-stream"),
    size: attachment.size,
  }, "shipment-evidence");
  return {
    ...attachment,
    id: `uploaded-${uploaded.id}`,
    fileId: uploaded.id,
    url: uploaded.url,
    name: uploaded.filename,
    contentType: uploaded.contentType,
  };
}

async function uploadDraftAttachments(draft: unknown): Promise<unknown> {
  if (!draft || typeof draft !== "object") return draft;
  const next = { ...(draft as Record<string, unknown>) };
  if (Array.isArray(next.cargoPhotos)) {
    next.cargoPhotos = await Promise.all(next.cargoPhotos.map((item) => isAttachment(item) ? uploadAttachment(item) : item));
  }
  if (isAttachment(next.supportingDocument)) {
    next.supportingDocument = await uploadAttachment(next.supportingDocument);
  }
  return next;
}

function addressText(address?: Address, fallback = "") {
  if (!address) return fallback;
  return [address.detail, address.area, address.city].filter(Boolean).join(", ");
}

function cargoRowsFrom(items?: BookingCargoItem[], fallback?: string, quantity?: number) {
  const rows = (items ?? []).filter((item) => item.name.trim()).map((item) => ({ name: item.name.trim(), quantity: item.quantity || 1 }));
  if (rows.length) return rows;
  return fallback?.trim() ? [{ name: fallback.trim(), quantity: quantity || 1 }] : [];
}

function contactOrFallback(contact: PersonContact | undefined, fallbackName = "Customer", fallbackPhone = "") {
  return { name: contact?.name?.trim() || fallbackName, phone: contact?.phone?.trim() || fallbackPhone };
}

export function portalSubmissionPayload(service: string, draft: unknown) {
  const raw = (draft && typeof draft === "object" ? draft : {}) as Record<string, any>;
  const receiver = contactOrFallback(raw.receiver ?? raw.consignee ?? raw.contact, "Customer", raw.sender?.phone ?? "");
  const sender = contactOrFallback(raw.sender ?? raw.contact, "Customer", receiver.phone);
  const pickup = service === "local"
    ? addressText(raw.pickup)
    : service === "import"
      ? [raw.originCity, raw.originCountry].filter(Boolean).join(", ")
      : service === "intercity"
        ? raw.originCity ?? ""
        : addressText(raw.pickup);
  const destination = service === "local"
    ? addressText(raw.destination)
    : service === "import"
      ? raw.destinationCity ?? ""
      : service === "intercity"
        ? raw.destinationCity ?? ""
      : addressText(raw.destination);
  const pickupBranchId = raw.pickup?.branchId ?? raw.originBranchId ?? raw.destinationBranchId;
  const destinationBranchId = raw.destination?.branchId ?? raw.destinationBranchId;
  return {
    service,
    draft,
    form: {
      pickup,
      destination,
      pickupBranchId,
      destinationBranchId,
      recipient: receiver.name,
      phone: receiver.phone,
      sender: sender.name,
      senderPhone: sender.phone,
      service,
      schedule: raw.schedule,
      transportMode: raw.method,
      fulfilment: raw.fulfilment,
      instructions: raw.deliveryInstructions ?? raw.requestDetail,
    },
    cargoRows: cargoRowsFrom(raw.cargoItems, raw.cargoDescription ?? raw.parcelDescription ?? raw.cargoCategory ?? raw.requestType, raw.quantity),
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
    const uploadedDraft = await uploadDraftAttachments(input.draft);
    const payload = portalSubmissionPayload(input.service, uploadedDraft);
    const draft = await apiClient.post<{ data: LaravelDraftResponse }>("/api/v1/shipment-drafts", {
      payload,
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
