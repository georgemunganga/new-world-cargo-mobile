import { useQueryClient } from "@tanstack/react-query";
import { customerQueries } from "@/lib/data/customer-queries";
import { useCustomerQuery } from "@/lib/data/use-customer-query";
import { repositories } from "@/lib/repositories";
import { useState } from "react";
import type { CreateSupportCaseInput, SupportCase } from "@/lib/domain/support";
import { customerSafeMessageFor } from "@/lib/api/errors";
export function useSupportCases() {
  const client = useQueryClient();
  const query = useCustomerQuery(customerQueries.support);
  const [submitting, setSubmitting] = useState(false),
    [error, setError] = useState("");
  const createCase = async (input: CreateSupportCaseInput) => {
    setSubmitting(true);
    setError("");
    try {
      const created = await repositories.support.createCase(input);
      await client.cancelQueries({
        queryKey: customerQueries.support.queryKey,
      });
      client.setQueryData<SupportCase[]>(
        customerQueries.support.queryKey,
        (current) => [
          created,
          ...(current ?? []).filter((x) => x.id !== created.id),
        ],
      );
      return created;
    } catch (e) {
      setError(customerSafeMessageFor(e));
      return null;
    } finally {
      setSubmitting(false);
    }
  };
  return {
    ...query,
    cases: query.data ?? [],
    status: submitting ? ("submitting" as const) : query.status,
    errorMessage: error || query.errorMessage,
    createCase,
  };
}
