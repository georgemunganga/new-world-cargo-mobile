import { useQueryClient } from "@tanstack/react-query";
import type { CustomerShipment } from "@/lib/domain/shipment";
import { repositories } from "@/lib/repositories";
import { useCustomerQuery } from "@/lib/data/use-customer-query";
export function useCustomerShipment(
  id?: string,
  options: { pollIntervalMs?: number } = {},
) {
  const client = useQueryClient();
  const query = useCustomerQuery({
    queryKey: ["shipment", id],
    initialData: () =>
      client
        .getQueryData<CustomerShipment[]>(["shipments"])
        ?.find((item) => item.id === id),
    initialDataUpdatedAt: () =>
      client.getQueryState(["shipments"])?.dataUpdatedAt ?? 0,
    queryFn: () =>
      id ? repositories.shipments.getShipment(id) : Promise.resolve(null),
    enabled: Boolean(id),
    staleTime: 15_000,
    refetchInterval: options.pollIntervalMs,
    refetchIntervalInBackground: false,
  });
  return {
    ...query,
    shipment: query.data ?? null,
    status:
      !id || (query.status === "success" && !query.data)
        ? ("not-found" as const)
        : query.status,
    lastUpdatedAt: query.dataUpdatedAt
      ? new Date(query.dataUpdatedAt).toISOString()
      : undefined,
    refresh: async () => (await query.refetch()).data ?? null,
  };
}
