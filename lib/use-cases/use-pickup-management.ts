import { useQueryClient } from "@tanstack/react-query";
import { useCustomerQuery } from "@/lib/data/use-customer-query";
import { useCallback, useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { Pickup } from "@/lib/domain/pickup";
import { repositories } from "@/lib/repositories";

export function usePickupManagement() {
  const client = useQueryClient();
  const query = useCustomerQuery({queryKey:["pickups"],queryFn:() => repositories.pickups.listPickups(),staleTime:30_000});
  const pickups = query.data ?? [];
  const setPickups = useCallback((update: (current: Pickup[]) => Pickup[]) => {client.setQueryData<Pickup[]>(["pickups"], current => update(current ?? []));}, [client]);
  const [mutationStatus,setStatus] = useState<"idle"|"updating"|"success"|"error">("idle");
  const [errorMessage,setErrorMessage] = useState("");
  const status = mutationStatus === "updating" ? mutationStatus : query.status;
  const refresh = query.refresh;
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
  }, [setPickups]);

  return {
    pickups,
    status,
    errorMessage: errorMessage || query.errorMessage,
    refresh,
    reschedulePickup: (shipmentId: string, slotId: string) => applyUpdate(() => repositories.pickups.reschedulePickup(shipmentId, slotId)),
    cancelPickup: (shipmentId: string) => applyUpdate(() => repositories.pickups.cancelPickup(shipmentId)),
    requestPickupHelp: (shipmentId: string) => applyUpdate(() => repositories.pickups.requestPickupHelp(shipmentId)),
    restorePickup: (shipmentId: string) => applyUpdate(() => repositories.pickups.restorePickup(shipmentId)),
  };
}
