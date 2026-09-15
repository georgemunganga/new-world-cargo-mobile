import { useQueryClient } from "@tanstack/react-query";
import { customerQueries } from "@/lib/data/customer-queries";
import { useCustomerQuery } from "@/lib/data/use-customer-query";
import { repositories } from "@/lib/repositories";
import { useState } from "react";
import type { CustomerNotification } from "@/lib/domain/notifications";
export function useCustomerNotifications() {
  const query = useCustomerQuery(customerQueries.notifications);
  const client = useQueryClient();
  const [error, setError] = useState("");
  const mark = async (id?: string) => {
    setError("");
    try {
      if (id) await repositories.notifications.markRead(id);
      else await repositories.notifications.markAllRead();
      await client.cancelQueries({
        queryKey: customerQueries.notifications.queryKey,
      });
      client.setQueryData<CustomerNotification[]>(
        customerQueries.notifications.queryKey,
        (current) =>
          (current ?? []).map((item) =>
            !id || item.id === id ? { ...item, unread: false } : item,
          ),
      );
    } catch {
      setError("We could not update notifications. Please try again.");
    }
  };
  return {
    notifications: query.data ?? [],
    status:
      query.status === "success"
        ? query.data?.length
          ? ("ready" as const)
          : ("empty" as const)
        : query.status,
    message: error || query.errorMessage,
    refresh: query.refresh,
    markRead: (id: string) => void mark(id),
    markAllRead: () => void mark(),
  };
}
export type CustomerNotificationsState = ReturnType<
  typeof useCustomerNotifications
>;
