import { useCallback, useEffect, useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { Pickup } from "@/lib/domain/pickup";
import { repositories } from "@/lib/repositories";

export function usePickupManagement() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "empty" | "error" | "updating">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const refresh = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const nextPickups = await repositories.pickups.listPickups();
      setPickups(nextPickups);
      setStatus(nextPickups.length ? "success" : "empty");
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const applyUpdate = useCallback(async (action: () => Promise<Pickup | null>) => {
    setStatus("updating");
    setErrorMessage("");
    try {
      const pickup = await action();
      if (pickup) setPickups((current) => current.map((item) => item.shipmentId === pickup.shipmentId ? pickup : item));
      setStatus("success");
      return pickup;
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
      return null;
    }
  }, []);

  return {
    pickups,
    status,
    errorMessage,
    refresh,
    reschedulePickup: (shipmentId: string, slotId: string) => applyUpdate(() => repositories.pickups.reschedulePickup(shipmentId, slotId)),
    cancelPickup: (shipmentId: string) => applyUpdate(() => repositories.pickups.cancelPickup(shipmentId)),
    requestPickupHelp: (shipmentId: string) => applyUpdate(() => repositories.pickups.requestPickupHelp(shipmentId)),
    restorePickup: (shipmentId: string) => applyUpdate(() => repositories.pickups.restorePickup(shipmentId)),
  };
}
