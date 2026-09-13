export type NotificationPreferences = {
  shipmentUpdates: boolean;
  billUpdates: boolean;
  marketing: boolean;
};

export type CustomerNotificationTone = "info" | "success" | "warning" | "error";

export type CustomerNotification = {
  id: string;
  title: string;
  detail: string;
  type: "progress" | "arrival" | "payment" | "exception" | "general";
  tone: CustomerNotificationTone;
  icon: string;
  route?: string;
  displayTime?: string;
  unread: boolean;
};

export type NotificationPreferenceSnapshot = NotificationPreferences & {
  pushRegistered?: boolean;
};

export const defaultNotificationPreferences: NotificationPreferences = {
  shipmentUpdates: true,
  billUpdates: true,
  marketing: false,
};
