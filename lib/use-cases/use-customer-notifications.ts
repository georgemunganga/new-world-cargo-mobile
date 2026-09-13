import { useCallback, useEffect, useState } from "react";
import type { CustomerNotification } from "@/lib/domain/notifications";
import { repositories } from "@/lib/repositories";

export type CustomerNotificationsState =
  | { status: "loading"; notifications: CustomerNotification[]; refresh: () => void; markRead: (id: string) => void; markAllRead: () => void }
  | { status: "ready" | "empty" | "error"; notifications: CustomerNotification[]; message?: string; refresh: () => void; markRead: (id: string) => void; markAllRead: () => void };

export function useCustomerNotifications(): CustomerNotificationsState {
  const [status, setStatus] = useState<CustomerNotificationsState["status"]>("loading");
  const [notifications, setNotifications] = useState<CustomerNotification[]>([]);
  const [message, setMessage] = useState<string | undefined>();

  const refresh = useCallback(() => {
    setStatus((current) => current === "ready" || current === "empty" ? "loading" : current);
    repositories.notifications.listNotifications().then((records) => {
      setNotifications(records);
      setStatus(records.length ? "ready" : "empty");
      setMessage(undefined);
    }).catch(() => {
      setStatus("error");
      setMessage("We could not load notifications. Please try again.");
    });
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((current) => current.map((item) => item.id === id ? { ...item, unread: false } : item));
    void repositories.notifications.markRead(id).catch(() => undefined);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, unread: false })));
    void repositories.notifications.markAllRead().catch(() => undefined);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { status, notifications, message, refresh, markRead, markAllRead };
}
