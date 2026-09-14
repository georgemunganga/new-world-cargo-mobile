import type { Shipment } from "@/types/cargo";

export type LiveTrackingHistoryEvent = {
  id: string;
  label: string;
  detail: string;
  time: string;
  state: "complete" | "current" | "upcoming";
};

export function getLiveTrackingHistory(shipment: Shipment): LiveTrackingHistoryEvent[] {
  if (shipment.trackingEvents?.length) {
    return shipment.trackingEvents.map((event) => ({ id: event.id, label: event.label, detail: event.detail, time: event.displayTime, state: event.state }));
  }
  const stages = shipment.trackingProgress?.stages ?? ["Booking confirmed", "Collection", "In transit", "Destination arrival"];
  const fraction = shipment.trackingProgress?.fraction ?? 0.25;
  const currentIndex = shipment.status === "pending" ? 0 : fraction < 0.28 ? 1 : fraction < 0.78 ? 2 : 3;
  const labels = [stages[0] ?? "Booking confirmed", stages[1] ?? "Collection", stages[2] ?? "In transit", stages[3] ?? "Destination arrival"];
  const details = [
    `Booking accepted · ${shipment.pickup.city}`,
    `Received at ${shipment.pickup.area} · ${shipment.pickup.city}`,
    `Moving toward ${shipment.destination.city}`,
    `Next handover: ${shipment.destination.area} · ${shipment.destination.city}`,
  ];
  const times = [shipment.dateLabel || "Recorded", "Pending", "Pending", shipment.eta];

  return labels.map((label, index) => ({
    id: `${shipment.id}-${index}`,
    label,
    detail: details[index],
    time: times[index],
    state: index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming",
  }));
}
