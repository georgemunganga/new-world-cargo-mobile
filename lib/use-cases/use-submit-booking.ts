import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { customerSafeMessageFor, MobileApiError } from "@/lib/api/errors";
import type { BookingService, BookingSubmissionResult } from "@/lib/domain/booking";
import { repositories } from "@/lib/repositories";
import { analytics } from "@/lib/services/observability/analytics";
import { errorReporter } from "@/lib/services/observability/error-reporter";

export function useSubmitBooking() {
  const client = useQueryClient();
  const inFlight = useRef(false);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<BookingSubmissionResult | null>(null);

  const submit = async (service: BookingService, draft: unknown, onQuoteRequired?: () => void) => {
    if (inFlight.current) return null;
    inFlight.current = true;
    setStatus("submitting");
    setErrorMessage("");
    try {
      const nextResult = await repositories.bookings.submitBooking({ service, draft });
      void client.invalidateQueries({queryKey:["shipments"]});
      void client.invalidateQueries({queryKey:["invoices"]});
      setResult(nextResult);
      setStatus("success");
      analytics.track("booking_submitted", { service, reference: nextResult.reference });
      return nextResult;
    } catch (error) {
      if (error instanceof MobileApiError && error.code === "QUOTE_REQUIRED") onQuoteRequired?.();
      errorReporter.capture(error, { workflow: "booking_submission", service });
      const message = customerSafeMessageFor(error);
      setErrorMessage(message);
      setStatus("error");
      return null;
    } finally {
      inFlight.current = false;
    }
  };

  return { status, errorMessage, result, submit };
}
