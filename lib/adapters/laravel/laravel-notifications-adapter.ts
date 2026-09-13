import { apiClient } from "@/lib/api/client";
import type { CustomerNotification, CustomerNotificationTone } from "@/lib/domain/notifications";
import type { NotificationsRepository } from "@/lib/repositories/types";

type LaravelNotificationType = "progress" | "arrival" | "payment" | "exception" | "general";

type LaravelNotification = {
  id?: string | number;
  type?: LaravelNotificationType | string;
  title?: string;
  body?: string;
  displayTime?: string;
  shipmentId?: string | number | null;
  unread?: boolean;
};

function toneFor(type: string): CustomerNotificationTone {
  if (type === "payment") return "warning";
  if (type === "arrival") return "success";
  if (type === "exception") return "error";
  return "info";
}

function iconFor(type: string) {
  if (type === "payment") return "receipt-text-outline";
  if (type === "arrival") return "truck-check-outline";
  if (type === "exception") return "alert-circle-outline";
  return "bell-outline";
}

function routeFor(raw: LaravelNotification) {
  if (raw.shipmentId) return `/shipments/${raw.shipmentId}`;
  if (raw.type === "payment") return "/bills";
  return undefined;
}

function mapNotification(raw: LaravelNotification): CustomerNotification {
  const type = (raw.type || "general").toString();
  const normalizedType: CustomerNotification["type"] = ["progress", "arrival", "payment", "exception"].includes(type) ? type as CustomerNotification["type"] : "general";
  return {
    id: String(raw.id ?? `${raw.title ?? "notification"}-${raw.displayTime ?? Date.now()}`),
    title: raw.title || "New WorldCargo update",
    detail: raw.body || "Open this update for more details.",
    type: normalizedType,
    tone: toneFor(normalizedType),
    icon: iconFor(normalizedType),
    route: routeFor(raw),
    displayTime: raw.displayTime,
    unread: Boolean(raw.unread),
  };
}

export const laravelNotificationsRepository: NotificationsRepository = {
  async listNotifications() {
    const response = await apiClient.get<{ data: LaravelNotification[] }>("/api/v1/notifications");
    return response.data.map(mapNotification);
  },
  async markRead(id) {
    const response = await apiClient.patch<{ data: LaravelNotification }>(`/api/v1/notifications/${encodeURIComponent(id)}/read`);
    return mapNotification(response.data);
  },
  async markAllRead() {
    await apiClient.post("/api/v1/notifications/read-all");
  },
};
