import { Platform } from "react-native";
import { apiClient } from "@/lib/api/client";
import type { NotificationPreferenceSnapshot, NotificationPreferences } from "@/lib/domain/notifications";
import type { NotificationPreferencesRepository } from "@/lib/repositories/types";
import { notificationService } from "@/lib/services/device/notification-service";

type LaravelNotificationPreferencesResponse = NotificationPreferenceSnapshot & {
  revision?: number;
};

function mapPreferences(raw: LaravelNotificationPreferencesResponse): NotificationPreferenceSnapshot {
  return {
    shipmentUpdates: Boolean(raw.shipmentUpdates),
    billUpdates: Boolean(raw.billUpdates),
    marketing: Boolean(raw.marketing),
    pushRegistered: Boolean(raw.pushRegistered),
  };
}

export const laravelNotificationPreferencesRepository: NotificationPreferencesRepository = {
  async getPreferences() {
    const response = await apiClient.get<{ data: LaravelNotificationPreferencesResponse }>("/api/v1/notifications/preferences");
    return mapPreferences(response.data);
  },
  async updatePreferences(input: Partial<NotificationPreferences>) {
    const response = await apiClient.patch<{ data: LaravelNotificationPreferencesResponse }>("/api/v1/notifications/preferences", input);
    return mapPreferences(response.data);
  },
  async registerPushToken() {
    const registration = await notificationService.registerForPush();
    if (!registration.ok) return this.getPreferences();
    const response = await apiClient.post<{ data: { registered: boolean } }>("/api/v1/notifications/push-token", {
      token: registration.value.token,
      provider: registration.value.provider,
      platform: Platform.OS,
    });
    void response;
    return this.getPreferences();
  },
  async revokePushToken() {
    await apiClient.delete("/api/v1/notifications/push-token");
  },
};
