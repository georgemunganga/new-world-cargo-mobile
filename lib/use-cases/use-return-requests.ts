import { useCallback, useEffect, useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { ReturnRequest, SubmitReturnRequestInput } from "@/lib/domain/return-request";
import { repositories } from "@/lib/repositories";

export function useReturnRequests() {
  const [requests, setRequests] = useState<ReturnRequest[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "empty" | "error" | "submitting">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const refresh = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const nextRequests = await repositories.returns.listRequests();
      setRequests(nextRequests);
      setStatus(nextRequests.length ? "success" : "empty");
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const submitReturn = useCallback(async (input: SubmitReturnRequestInput) => {
    setStatus("submitting");
    setErrorMessage("");
    try {
      const request = await repositories.returns.submitReturn(input);
      setRequests((current) => [request, ...current.filter((item) => item.shipmentId !== request.shipmentId)]);
      setStatus("success");
      return request;
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
      return null;
    }
  }, []);

  return { requests, status, errorMessage, refresh, submitReturn };
}
