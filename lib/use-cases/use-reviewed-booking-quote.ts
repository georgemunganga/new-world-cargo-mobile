import { useEffect, useRef, useState } from "react";
import {
  bookingQuoteRequestFromDraft,
  estimateBookingQuote,
  requireReviewedQuote,
} from "@/lib/booking-pricing";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { BookingService } from "@/lib/domain/booking";
import type { BookingQuote } from "@/types/cargo";

export function useReviewedBookingQuote(
  service: BookingService,
  draft: { quote?: BookingQuote },
  update: (patch: { quote?: BookingQuote }) => void,
) {
  const requestKey = JSON.stringify(
    bookingQuoteRequestFromDraft(service, draft),
  );
  const latest = useRef({ draft, update });
  latest.current = { draft, update };
  const [version, setVersion] = useState(0);
  const [state, setState] = useState({
    key: "",
    version: -1,
    loading: true,
    error: "",
  });

  useEffect(() => {
    let active = true;
    setState({ key: requestKey, version, loading: true, error: "" });
    void estimateBookingQuote(service, latest.current.draft)
      .then((quote) => {
        if (!active) return;
        requireReviewedQuote(service, { ...latest.current.draft, quote });
        latest.current.update({ quote: quote! });
        setState({ key: requestKey, version, loading: false, error: "" });
      })
      .catch((error) => {
        if (active)
          setState({
            key: requestKey,
            version,
            loading: false,
            error: customerSafeMessageFor(error),
          });
      });
    return () => {
      active = false;
    };
  }, [service, requestKey, version]);

  const loading =
    state.loading || state.key !== requestKey || state.version !== version;
  const refresh = () => setVersion((value) => value + 1);
  const confirmable = () => {
    if (loading) return false;
    try {
      if (state.error) throw new Error(state.error);
      requireReviewedQuote(service, latest.current.draft);
      return true;
    } catch {
      refresh();
      return false;
    }
  };
  return { loading, error: state.error, refresh, confirmable };
}
