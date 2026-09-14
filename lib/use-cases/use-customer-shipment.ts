import { useCallback, useEffect, useRef, useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { CustomerShipment } from "@/lib/domain/shipment";
import { repositories } from "@/lib/repositories";

export function useCustomerShipment(id?: string, options: { pollIntervalMs?: number } = {}) {
  const [shipment, setShipment] = useState<CustomerShipment | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "not-found" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isStale, setIsStale] = useState(false);
  const [lastUpdatedAt, setLastUpdatedAt] = useState<string>();
  const shipmentRef = useRef<CustomerShipment | null>(null);

  const refresh = useCallback(async () => {
    if (!id) {
      setStatus("not-found");
      setShipment(null);
      return null;
    }
    setStatus((current) => shipmentRef.current && current === "success" ? current : "loading");
    setErrorMessage("");
    try {
      const nextShipment = await repositories.shipments.getShipment(id);
      shipmentRef.current = nextShipment;
      setShipment(nextShipment);
      setStatus(nextShipment ? "success" : "not-found");
      setIsStale(false);
      setLastUpdatedAt(new Date().toISOString());
      return nextShipment;
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      if (shipmentRef.current) {
        setIsStale(true);
        setStatus("success");
      } else {
        setStatus("error");
        setShipment(null);
      }
      return null;
    }
  }, [id]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!options.pollIntervalMs || options.pollIntervalMs < 1000) return;
    const timer = setInterval(() => void refresh(), options.pollIntervalMs);
    return () => clearInterval(timer);
  }, [options.pollIntervalMs, refresh]);

  return { shipment, status, errorMessage, isStale, lastUpdatedAt, refresh };
}
