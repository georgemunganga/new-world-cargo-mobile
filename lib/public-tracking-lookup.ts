import type { Shipment } from "@/types/cargo";
import { findShipmentForTrackingCode } from "./mock-tracking-scan";

export type PublicTrackingLookupResult =
  | { kind: "found"; shipment: Shipment }
  | { kind: "not-found"; message: string }
  | { kind: "unavailable"; message: string };

export function resolvePublicTrackingLookup(code: string, shipments: Shipment[]): PublicTrackingLookupResult {
  const normalized = code.trim();
  if (!normalized) return { kind: "not-found", message: "Enter a tracking number to continue." };
  if (normalized.toUpperCase() === "NWC-OFFLINE") return { kind: "unavailable", message: "Tracking is temporarily unavailable. Your shipment is safe; please try again." };
  const shipment = findShipmentForTrackingCode(normalized, shipments);
  if (!shipment) return { kind: "not-found", message: "Shipment not found. Check the code and try again." };
  return { kind: "found", shipment };
}
