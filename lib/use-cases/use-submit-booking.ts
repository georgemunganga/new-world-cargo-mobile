import { useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { BookingService, BookingSubmissionResult } from "@/lib/domain/booking";
import { repositories } from "@/lib/repositories";
import { analytics } from "@/lib/services/observability/analytics";

export function useSubmitBooking() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<BookingSubmissionResult | null>(null);

  const submit = async (service: BookingService, draft: unknown) => {
    setStatus("submitting");
    setErrorMessage("");
    try {
      const nextResult = await repositories.bookings.submitBooking({ service, draft });
      setResult(nextResult);
      setStatus("success");
      analytics.track("booking_submitted", { service, reference: nextResult.reference });
      return nextResult;
    } catch (error) {
      const message = customerSafeMessageFor(error);
      setErrorMessage(message);
      setStatus("error");
      return null;
    }
  };

  return { status, errorMessage, result, submit };
}
