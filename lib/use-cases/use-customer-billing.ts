import { useCallback, useEffect, useState } from "react";
import { repositories } from "@/lib/repositories";
import type { CustomerInvoice } from "@/lib/domain/billing";
import { customerSafeMessageFor } from "@/lib/api/errors";
import { analytics } from "@/lib/services/observability/analytics";
import { readCache, writeCache } from "@/lib/storage/cache-storage";
import { storageKeys } from "@/lib/storage/storage-keys";

export function useCustomerBilling() {
  const [invoices, setInvoices] = useState<CustomerInvoice[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "empty" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isStale, setIsStale] = useState(false);

  const refresh = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    setIsStale(false);
    try {
      const records = await repositories.billing.listInvoices();
      await writeCache(storageKeys.billingCache, records);
      setInvoices(records);
      setStatus(records.length ? "success" : "empty");
    } catch (error) {
      const cached = await readCache<CustomerInvoice[]>(storageKeys.billingCache);
      if (cached?.value.length) {
        setInvoices(cached.value);
        setIsStale(true);
        setErrorMessage("Showing your last saved bill list. Pull to refresh when your connection is back.");
        setStatus("success");
        return;
      }
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
    }
  }, []);

  const openInvoice = useCallback(async (id: string) => {
    analytics.track("invoice_opened", { invoiceId: id });
    return repositories.billing.getInvoice(id);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { invoices, status, errorMessage, isStale, refresh, openInvoice };
}
