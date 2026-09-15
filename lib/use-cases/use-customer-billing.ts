import { customerQueries } from "@/lib/data/customer-queries";
import { useCustomerQuery } from "@/lib/data/use-customer-query";
import { repositories } from "@/lib/repositories";
export function useCustomerBilling() {
  const query = useCustomerQuery(customerQueries.invoices);
  return {
    ...query,
    invoices: query.data ?? [],
    status:
      query.status === "success" && !query.data?.length
        ? ("empty" as const)
        : query.status,
    openInvoice: (id: string) => repositories.billing.getInvoice(id),
  };
}
