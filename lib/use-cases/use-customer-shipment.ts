import { useCallback, useEffect, useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { CustomerShipment } from "@/lib/domain/shipment";
import { repositories } from "@/lib/repositories";

export function useCustomerShipment(id?: string) {
  const [shipment, setShipment] = useState<CustomerShipment | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "not-found" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const refresh = useCallback(async () => {
    if (!id) {
      setStatus("not-found");
      setShipment(null);
      return null;
    }
    setStatus("loading");
    setErrorMessage("");
    try {
      const nextShipment = await repositories.shipments.getShipment(id);
      setShipment(nextShipment);
      setStatus(nextShipment ? "success" : "not-found");
      return nextShipment;
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
      setShipment(null);
      return null;
    }
  }, [id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { shipment, status, errorMessage, refresh };
}
