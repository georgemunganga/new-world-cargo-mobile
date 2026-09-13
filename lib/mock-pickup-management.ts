import { pickupSlotFor, pickupSlots, pickupStatusLabel, type Pickup, type PickupSlot, type PickupStatus } from "@/lib/domain/pickup";

export type MockPickupStatus = PickupStatus;
export type MockPickupSlot = PickupSlot;
export type MockPickup = Pickup;

export const mockPickupSlots = pickupSlots;

export const mockPickups: MockPickup[] = [
  { shipmentId: "nwc-23990", shipmentReference: "NWC-784089", location: "New WorldCargo consolidation point, Jebel Ali", collectionPoint: "Supplier handover · Dubai", scheduledSlotId: "today-pm", status: "scheduled" },
];

export { pickupSlotFor, pickupStatusLabel };
