import type { Shipment } from "@/types/cargo";

export type LiveTrackingHistoryEvent = {
  id: string;
  label: string;
  detail: string;
  time: string;
  state: "complete" | "current" | "upcoming";
};

export function getLiveTrackingHistory(shipment: Shipment): LiveTrackingHistoryEvent[] {
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
  const times = ["30 Aug · 09:20", "30 Aug · 11:05", "Today · 10:35", shipment.eta];

  return labels.map((label, index) => ({
    id: `${shipment.id}-${index}`,
    label,
    detail: details[index],
    time: times[index],
    state: index < currentIndex ? "complete" : index === currentIndex ? "current" : "upcoming",
  }));
}
