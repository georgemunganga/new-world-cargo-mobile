import { useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { BookingService } from "@/lib/domain/booking";
import { repositories } from "@/lib/repositories";

/**
 * Persists an unfinished booking. Callers must only navigate away once this
 * resolves, so the customer is never told a draft was kept when it was not.
 */
export function useSaveBookingDraft() {
  const [status, setStatus] = useState<"idle" | "saving" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const save = async (service: BookingService, draft: unknown) => {
    setStatus("saving");
    setErrorMessage("");
    try {
      await repositories.bookings.saveDraft({ service, draft });
      setStatus("idle");
      return true;
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
      return false;
    }
  };

  return { status, errorMessage, save };
}
