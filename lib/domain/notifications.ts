export type NotificationPreferences = {
  shipmentUpdates: boolean;
  billUpdates: boolean;
  marketing: boolean;
};

export type NotificationPreferenceSnapshot = NotificationPreferences & {
  pushRegistered?: boolean;
};

export const defaultNotificationPreferences: NotificationPreferences = {
  shipmentUpdates: true,
  billUpdates: true,
  marketing: false,
};
