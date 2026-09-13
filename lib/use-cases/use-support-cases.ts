import { useCallback, useEffect, useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { CreateSupportCaseInput, SupportCase } from "@/lib/domain/support";
import { repositories } from "@/lib/repositories";

export function useSupportCases() {
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "empty" | "error" | "submitting">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const refresh = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const nextCases = await repositories.support.listCases();
      setCases(nextCases);
      setStatus(nextCases.length ? "success" : "empty");
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const createCase = useCallback(async (input: CreateSupportCaseInput) => {
    setStatus("submitting");
    setErrorMessage("");
    try {
      const created = await repositories.support.createCase(input);
      setCases((current) => [created, ...current.filter((item) => item.id !== created.id)]);
      setStatus("success");
      return created;
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
      return null;
    }
  }, []);

  return { cases, status, errorMessage, refresh, createCase };
}
