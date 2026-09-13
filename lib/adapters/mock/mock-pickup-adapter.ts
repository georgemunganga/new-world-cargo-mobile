import { mockPickups } from "@/lib/mock-pickup-management";
import { reschedulePickupSlot, updatePickupStatus, type Pickup } from "@/lib/domain/pickup";
import type { PickupRepository } from "@/lib/repositories/types";

const pickups: Pickup[] = [...mockPickups];

function update(shipmentId: string, updater: (pickup: Pickup) => Pickup) {
  const index = pickups.findIndex((pickup) => pickup.shipmentId === shipmentId);
  if (index < 0) return null;
  pickups[index] = updater(pickups[index]);
  return pickups[index];
}

export const mockPickupRepository: PickupRepository = {
  async listPickups() {
    return pickups;
  },
  async reschedulePickup(shipmentId, slotId) {
    return update(shipmentId, (pickup) => reschedulePickupSlot(pickup, slotId));
  },
  async cancelPickup(shipmentId) {
    return update(shipmentId, (pickup) => updatePickupStatus(pickup, "cancelled"));
  },
  async requestPickupHelp(shipmentId) {
    return update(shipmentId, (pickup) => updatePickupStatus(pickup, "needs-support"));
  },
  async restorePickup(shipmentId) {
    return update(shipmentId, (pickup) => updatePickupStatus(pickup, "scheduled"));
  },
};
