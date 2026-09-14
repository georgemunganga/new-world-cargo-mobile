import type { CustomerShipment } from "@/lib/domain/shipment";

export type PortalShipment = {
  id: number | string;
  trackingNumber?: string;
  code?: string;
  reference?: string;
  packageName?: string;
  parcelOwner?: string;
  title?: string;
  transportMode?: "air" | "sea" | string;
  service?: CustomerShipment["service"];
  status?: CustomerShipment["status"];
  statusLabel?: string;
  origin?: CustomerShipment["origin"] | string | null;
  destination?: CustomerShipment["destination"] | string | null;
  etaLabel?: string;
  eta_label?: string;
  date_label?: string;
  branch_id?: number | string | null;
  progress?: number | string | null;
  events?: {
    id?: string | number;
    label?: string;
    detail?: string;
    occurredAt?: string | null;
    displayTime?: string;
    complete?: boolean;
    current?: boolean;
  }[];
  updatedAt?: string | null;
  revision?: number | string;
};

function addressFrom(value: PortalShipment["origin"], fallback: string): CustomerShipment["origin"] {
  if (value && typeof value === "object") return value;
  return { city: value || fallback };
}

export function mapPortalShipment(item: PortalShipment): CustomerShipment {
  const mode = item.transportMode === "sea" || item.transportMode === "air" ? item.transportMode : undefined;
  const service = item.service ?? (mode ? "import" : "local");
  const code = item.trackingNumber || item.code || item.reference || String(item.id);
  const title = item.parcelOwner || item.packageName || item.title || "Shipment";
  const progressPercent = Math.max(0, Math.min(100, Number(item.progress ?? 0) || 0));
  const status = normalizeStatus(item.status);
  const events = (item.events ?? []).map((event, index) => ({
    id: String(event.id ?? `${item.id}-event-${index}`),
    label: event.label || "Tracking update",
    detail: event.detail || `Shipment ${code}`,
    ...(event.occurredAt ? { occurredAt: event.occurredAt } : {}),
    displayTime: event.displayTime || (event.current ? "Current stage" : "Pending"),
    state: event.current ? "current" as const : event.complete ? "complete" as const : "upcoming" as const,
  }));
  return {
    id: String(item.id),
    code,
    title,
    service,
    status,
    origin: addressFrom(item.origin, "Origin"),
    destination: addressFrom(item.destination, "Destination"),
    etaLabel: item.etaLabel ?? item.eta_label,
    dateLabel: item.date_label,
    trackingProgress: {
      distanceLabel: status === "delivered" ? "Delivery complete" : `${progressPercent}% of recorded journey`,
      pickupTime: events.find((event) => event.state === "complete")?.displayTime ?? "Awaiting pickup",
      arrivalTime: item.etaLabel ?? item.eta_label ?? "To be confirmed",
      fraction: progressPercent / 100,
      mapLabel: `${addressFrom(item.origin, "Origin").city} to ${addressFrom(item.destination, "Destination").city}`,
      stages: events.map((event) => event.label),
    },
    trackingEvents: events,
    ...(item.updatedAt ? { updatedAt: item.updatedAt } : {}),
    revision: Number(item.revision ?? 1) || 1,
    ...(item.branch_id ? { branchId: String(item.branch_id) } : {}),
  };
}

function normalizeStatus(status?: string): CustomerShipment["status"] {
  if (status === "booking_confirmed" || status === "in_transit" || status === "out_for_delivery" || status === "delivered" || status === "cancelled" || status === "exception" || status === "action_required" || status === "pending") return status;
  if (status === "at_destination") return "in_transit";
  if (status === "failed") return "exception";
  return "pending";
}
