export type MockPickupStatus = "scheduled" | "rescheduled" | "cancelled" | "needs-support";
export type MockPickupSlot = { id: string; label: string; detail: string };
export type MockPickup = { shipmentId: string; shipmentReference: string; location: string; collectionPoint: string; scheduledSlotId: string; status: MockPickupStatus };

export const mockPickupSlots: MockPickupSlot[] = [
  { id: "today-pm", label: "Today · 15:00–17:00", detail: "Available pickup window" },
  { id: "tomorrow-am", label: "Tomorrow · 09:00–11:00", detail: "Earliest next window" },
  { id: "tomorrow-pm", label: "Tomorrow · 14:00–16:00", detail: "Later collection window" },
];

export const mockPickups: MockPickup[] = [
  { shipmentId: "nwc-23990", shipmentReference: "NWC-784089", location: "New WorldCargo consolidation point, Jebel Ali", collectionPoint: "Supplier handover · Dubai", scheduledSlotId: "today-pm", status: "scheduled" },
];

export function pickupSlotFor(id: string) { return mockPickupSlots.find((slot) => slot.id === id) ?? mockPickupSlots[0]; }

export function pickupStatusLabel(status: MockPickupStatus) { return { scheduled: "Pickup scheduled", rescheduled: "Pickup rescheduled", cancelled: "Pickup cancelled", "needs-support": "Pickup assistance" }[status]; }
