import type { ShipmentStatus } from "@/types/cargo";

export const statusPresentation: Record<ShipmentStatus, { label: string; tone: "info" | "success" | "warning" | "neutral"; icon: string }> = {
  action_required: { label: "Action required", tone: "warning", icon: "alert-circle-outline" },
  booking_confirmed: { label: "Booking confirmed", tone: "info", icon: "check-circle-outline" },
  in_transit: { label: "In transit", tone: "info", icon: "truck-fast-outline" },
  out_for_delivery: { label: "Out for delivery", tone: "info", icon: "map-marker-path" },
  delivered: { label: "Delivered", tone: "success", icon: "package-variant-closed-check" },
  pending: { label: "Pending", tone: "info", icon: "clock-outline" },
};
