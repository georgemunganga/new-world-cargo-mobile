import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import { mockPickups, type MockPickup, type MockPickupStatus } from "@/lib/mock-pickup-management";

type MockPickupManagementContextValue = { pickups: MockPickup[]; reschedulePickup: (shipmentId: string, slotId: string) => void; cancelPickup: (shipmentId: string) => void; requestPickupHelp: (shipmentId: string) => void; restorePickup: (shipmentId: string) => void };
const MockPickupManagementContext = createContext<MockPickupManagementContextValue | null>(null);

export function MockPickupManagementProvider({ children }: PropsWithChildren) {
  const [pickups, setPickups] = useState(mockPickups);
  const updateStatus = (shipmentId: string, status: MockPickupStatus) => setPickups((items) => items.map((pickup) => pickup.shipmentId === shipmentId ? { ...pickup, status } : pickup));
  const reschedulePickup = (shipmentId: string, slotId: string) => setPickups((items) => items.map((pickup) => pickup.shipmentId === shipmentId ? { ...pickup, scheduledSlotId: slotId, status: "rescheduled" } : pickup));
  const cancelPickup = (shipmentId: string) => updateStatus(shipmentId, "cancelled");
  const requestPickupHelp = (shipmentId: string) => updateStatus(shipmentId, "needs-support");
  const restorePickup = (shipmentId: string) => updateStatus(shipmentId, "scheduled");
  const value = useMemo(() => ({ pickups, reschedulePickup, cancelPickup, requestPickupHelp, restorePickup }), [pickups]);
  return <MockPickupManagementContext.Provider value={value}>{children}</MockPickupManagementContext.Provider>;
}

export function useMockPickupManagement() {
  const context = useContext(MockPickupManagementContext);
  if (!context) throw new Error("useMockPickupManagement must be used within MockPickupManagementProvider");
  return context;
}
