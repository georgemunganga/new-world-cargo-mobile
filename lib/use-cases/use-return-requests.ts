import { useQueryClient } from "@tanstack/react-query";
import { useCustomerQuery } from "@/lib/data/use-customer-query";
import { useCallback, useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { ReturnRequest, SubmitReturnRequestInput } from "@/lib/domain/return-request";
import { repositories } from "@/lib/repositories";

export function useReturnRequests() {
  const client = useQueryClient();
  const query = useCustomerQuery({queryKey:["returns"],queryFn:() => repositories.returns.listRequests(),staleTime:30_000});
  const requests = query.data ?? [];
  const setRequests = useCallback((update: (current: ReturnRequest[]) => ReturnRequest[]) => {client.setQueryData<ReturnRequest[]>(["returns"], current => update(current ?? []));}, [client]);
  const [mutationStatus,setStatus] = useState<"idle"|"submitting"|"success"|"error">("idle");
  const [errorMessage,setErrorMessage] = useState("");
  const status = mutationStatus === "submitting" ? mutationStatus : query.status;
  const refresh = query.refresh;
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
  }, [setRequests]);

  return { requests, status, errorMessage: errorMessage || query.errorMessage, refresh, submitReturn };
}
