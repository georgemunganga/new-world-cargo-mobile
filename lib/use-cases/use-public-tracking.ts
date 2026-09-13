import { useState } from "react";
import { repositories } from "@/lib/repositories";
import { normaliseTrackingCode, type TrackingResult } from "@/lib/domain/tracking";
import { customerSafeMessageFor } from "@/lib/api/errors";
import { readCache, writeCache } from "@/lib/storage/cache-storage";
import { storageKeys } from "@/lib/storage/storage-keys";

type TrackingCache = Record<string, TrackingResult>;

export function usePublicTracking() {
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [isStale, setIsStale] = useState(false);

  const track = async (code: string) => {
    const cacheKey = normaliseTrackingCode(code);
    setStatus("loading");
    setErrorMessage("");
    setIsStale(false);
    try {
      const nextResult = await repositories.tracking.trackByCode(code);
      if (cacheKey && nextResult.kind === "found") {
        const cached = (await readCache<TrackingCache>(storageKeys.trackingCache))?.value ?? {};
        await writeCache(storageKeys.trackingCache, { ...cached, [cacheKey]: nextResult });
      }
      setResult(nextResult);
      setStatus("success");
      return nextResult;
    } catch (error) {
      const cachedResult = cacheKey ? (await readCache<TrackingCache>(storageKeys.trackingCache))?.value[cacheKey] : undefined;
      if (cachedResult) {
        setResult(cachedResult);
        setIsStale(true);
        setErrorMessage("Showing the last saved tracking result for this code.");
        setStatus("success");
        return cachedResult;
      }
      const message = customerSafeMessageFor(error);
      setErrorMessage(message);
      setResult({ kind: "unavailable", message, retryable: true });
      setStatus("error");
      return null;
    }
  };

  return { result, status, errorMessage, isStale, track };
}
