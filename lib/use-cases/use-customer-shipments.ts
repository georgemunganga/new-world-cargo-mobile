import { customerQueries } from "@/lib/data/customer-queries";
import { useCustomerQuery } from "@/lib/data/use-customer-query";

export function useCustomerShipments() {
  const query = useCustomerQuery(customerQueries.shipments);
  return {
    ...query,
    shipments: query.data ?? [],
    status:
      query.status === "success" && !query.data?.length
        ? ("empty" as const)
        : query.status,
  };
}
