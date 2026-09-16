import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { repositories } from "@/lib/repositories";
import {
  normaliseTrackingCode,
  type TrackingResult,
} from "@/lib/domain/tracking";
import { customerSafeMessageFor } from "@/lib/api/errors";
export function usePublicTracking() {
  const client = useQueryClient();
  const version = useRef(0);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isStale, setIsStale] = useState(false);
  const track = async (code: string) => {
    const request = ++version.current;
    // The portal matches `code` exactly, so send the normalised form --
    // a lowercase or spaced entry would otherwise 404 on a real shipment.
    const lookupCode = normaliseTrackingCode(code);
    const queryKey = ["public-tracking", lookupCode];
    const cached = client.getQueryData<TrackingResult>(queryKey);
    setResult(cached ?? null);
    setStatus(cached ? "success" : "loading");
    setIsStale(Boolean(cached));
    setErrorMessage("");
    try {
      const next = await client.fetchQuery({
        queryKey,
        queryFn: () => repositories.tracking.trackByCode(lookupCode),
        staleTime: 15_000,
        networkMode: "always",
      });
      if (request !== version.current) return null;
      setResult(next);
      setStatus("success");
      setIsStale(false);
      return next;
    } catch (error) {
      if (request !== version.current) return null;
      setErrorMessage(
        cached
          ? "Showing the last saved tracking result."
          : customerSafeMessageFor(error),
      );
      setStatus(cached ? "success" : "error");
      setIsStale(Boolean(cached));
      return cached ?? null;
    }
  };
  return { result, status, errorMessage, isStale, track };
}
