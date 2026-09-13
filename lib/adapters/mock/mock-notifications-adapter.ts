import type { CustomerNotification } from "@/lib/domain/notifications";
import type { NotificationsRepository } from "@/lib/repositories/types";

const notifications: CustomerNotification[] = [
  { id: "payment", title: "Final price is ready", detail: "Review the bill for your import cargo before it moves.", type: "payment", tone: "warning", icon: "alert-circle-outline", route: "/bills", unread: true },
  { id: "delivery", title: "Your shipment is out for delivery", detail: "Your shipment is expected today. We will keep you updated.", type: "arrival", tone: "info", icon: "truck-fast-outline", route: "/shipments", unread: true },
  { id: "receipt", title: "Shipment delivered", detail: "Proof of delivery is available.", type: "arrival", tone: "success", icon: "check-circle-outline", route: "/shipments", unread: false },
];

export const mockNotificationsRepository: NotificationsRepository = {
  async listNotifications() {
    return [...notifications];
  },
  async markRead(id) {
    const notice = notifications.find((item) => item.id === id);
    if (notice) notice.unread = false;
    return notice ?? null;
  },
  async markAllRead() {
    notifications.forEach((item) => {
      item.unread = false;
    });
  },
};
