import { useCallback, useEffect, useState } from "react";
import { repositories } from "@/lib/repositories";
import type { CustomerShipment } from "@/lib/domain/shipment";
import { customerSafeMessageFor } from "@/lib/api/errors";
import { readCache, writeCache } from "@/lib/storage/cache-storage";
import { storageKeys } from "@/lib/storage/storage-keys";

export function useCustomerShipments() {
  const [shipments, setShipments] = useState<CustomerShipment[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "empty" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isStale, setIsStale] = useState(false);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    setIsStale(false);
    try {
      const records = await repositories.shipments.listShipments();
      await writeCache(storageKeys.shipmentCache, records);
      setShipments(records);
      setStatus(records.length ? "success" : "empty");
    } catch (error) {
      const cached = await readCache<CustomerShipment[]>(storageKeys.shipmentCache);
      if (cached?.value.length) {
        setShipments(cached.value);
        setIsStale(true);
        setErrorMessage("Showing your last saved shipment list. Pull to refresh when your connection is back.");
        setStatus("success");
        return;
      }
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { shipments, status, errorMessage, isStale, refresh };
}
