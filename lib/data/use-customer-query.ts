import { useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useQueryClient } from "@tanstack/react-query";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import { useCustomerAuth } from "@/stores/customer-auth";
import { customerSafeMessageFor } from "@/lib/api/errors";
export function useCustomerQuery<T>(options: UseQueryOptions<T, Error, T>) {
  const { customer, isRestoring } = useCustomerAuth();
  const query = useQuery({
    ...options,
    enabled: Boolean(customer) && !isRestoring && options.enabled !== false,
  });
  const customerId = customer?.id;
  const client = useQueryClient();
  const latestOptions = useRef(options);
  latestOptions.current = options;
  const key = JSON.stringify(options.queryKey);
  useFocusEffect(
    useCallback(() => {
      if (
        customerId &&
        !isRestoring &&
        latestOptions.current.enabled !== false
      ) {
        if (JSON.stringify(latestOptions.current.queryKey) === key) {
          void client.prefetchQuery(latestOptions.current);
        }
      }
    }, [client, key, customerId, isRestoring]),
  );
  const hasData = query.data !== undefined;
  const status = hasData
    ? ("success" as const)
    : query.isError || query.fetchStatus === "paused"
      ? ("error" as const)
      : ("loading" as const);
  return {
    ...query,
    status,
    errorMessage: query.error
      ? customerSafeMessageFor(query.error)
      : query.fetchStatus === "paused"
        ? "Offline. Showing saved information where available."
        : "",
    isStale: hasData && (query.isError || query.fetchStatus === "paused"),
    refresh: () => query.refetch(),
  };
}
