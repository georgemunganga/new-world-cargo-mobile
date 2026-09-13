export type PickupStatus = "scheduled" | "rescheduled" | "cancelled" | "needs-support";

export type PickupSlot = {
  id: string;
  label: string;
  detail: string;
};

export type Pickup = {
  shipmentId: string;
  shipmentReference: string;
  location: string;
  collectionPoint: string;
  scheduledSlotId: string;
  status: PickupStatus;
};

export const pickupSlots: PickupSlot[] = [
  { id: "today-pm", label: "Today · 15:00–17:00", detail: "Available pickup window" },
  { id: "tomorrow-am", label: "Tomorrow · 09:00–11:00", detail: "Earliest next window" },
  { id: "tomorrow-pm", label: "Tomorrow · 14:00–16:00", detail: "Later collection window" },
];

export function pickupSlotFor(id: string) {
  return pickupSlots.find((slot) => slot.id === id) ?? pickupSlots[0];
}

export function pickupStatusLabel(status: PickupStatus) {
  return { scheduled: "Pickup scheduled", rescheduled: "Pickup rescheduled", cancelled: "Pickup cancelled", "needs-support": "Pickup assistance" }[status];
}

export function updatePickupStatus(pickup: Pickup, status: PickupStatus): Pickup {
  return { ...pickup, status };
}

export function reschedulePickupSlot(pickup: Pickup, scheduledSlotId: string): Pickup {
  return { ...pickup, scheduledSlotId, status: "rescheduled" };
}
