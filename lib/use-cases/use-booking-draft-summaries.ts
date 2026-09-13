import { useCallback, useEffect, useState } from "react";
import { repositories } from "@/lib/repositories";
import type { BookingDraftSummary } from "@/lib/domain/booking";
import { customerSafeMessageFor } from "@/lib/api/errors";
import { readStoredDraftSummaries, writeStoredDraftSummaries } from "@/lib/storage/draft-storage";

export function useBookingDraftSummaries() {
  const [drafts, setDrafts] = useState<BookingDraftSummary[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "empty" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const refresh = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const stored = await readStoredDraftSummaries();
      const records = stored.length ? stored : await repositories.bookings.listDrafts();
      setDrafts(records);
      await writeStoredDraftSummaries(records);
      setStatus(records.length ? "success" : "empty");
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { drafts, status, errorMessage, refresh };
}
