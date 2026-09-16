import type { ShipmentStatus } from "@/lib/domain/shipment";

/**
 * Covers every status in the portal contract. The server also sends a
 * `statusLabel` (e.g. "Approved" while the machine status is still "pending");
 * prefer that for display and fall back to these when it is absent.
 */
export const statusPresentation: Record<ShipmentStatus, { label: string; tone: "info" | "success" | "warning" | "neutral" | "error"; icon: string }> = {
  pending: { label: "Pending", tone: "info", icon: "clock-outline" },
  pickup_scheduled: { label: "Pickup scheduled", tone: "info", icon: "calendar-clock-outline" },
  picked_up: { label: "Picked up", tone: "info", icon: "package-variant-closed-check" },
  in_transit: { label: "In transit", tone: "info", icon: "truck-fast-outline" },
  at_destination: { label: "At destination", tone: "info", icon: "warehouse" },
  out_for_delivery: { label: "Out for delivery", tone: "info", icon: "map-marker-path" },
  delivered: { label: "Delivered", tone: "success", icon: "package-variant-closed-check" },
  delayed: { label: "Delayed", tone: "warning", icon: "clock-alert-outline" },
  failed: { label: "Not delivered", tone: "error", icon: "alert-circle-outline" },
  cancelled: { label: "Cancelled", tone: "neutral", icon: "close-circle-outline" },
};

/** Terminal states. A shipment in one of these is no longer moving. */
const terminalStatuses: ShipmentStatus[] = ["delivered", "cancelled", "failed"];

export function isTerminalStatus(status: ShipmentStatus) {
  return terminalStatuses.includes(status);
}

/** True while the shipment can still be cancelled by the customer. */
export function isCancellableStatus(status: ShipmentStatus) {
  return status === "pending" || status === "pickup_scheduled";
}
