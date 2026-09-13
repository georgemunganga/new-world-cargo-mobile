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
};

function addressFrom(value: PortalShipment["origin"], fallback: string): CustomerShipment["origin"] {
  if (value && typeof value === "object") return value;
  return { city: value || fallback };
}

export function mapPortalShipment(item: PortalShipment): CustomerShipment {
  const mode = item.transportMode === "sea" || item.transportMode === "air" ? item.transportMode : undefined;
  const service = item.service ?? (mode ? "import" : "custom");
  const code = item.trackingNumber || item.code || item.reference || String(item.id);
  const title = item.parcelOwner || item.packageName || item.title || "Shipment";
  return {
    id: String(item.id),
    code,
    title,
    service,
    status: item.status || "pending",
    origin: addressFrom(item.origin, "Origin"),
    destination: addressFrom(item.destination, "Destination"),
    etaLabel: item.etaLabel ?? item.eta_label,
    dateLabel: item.date_label,
    ...(item.branch_id ? { branchId: String(item.branch_id) } : {}),
  };
}
