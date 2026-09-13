import type { NotificationPreferenceSnapshot, NotificationPreferences } from "@/lib/domain/notifications";
import type { NotificationPreferencesRepository } from "@/lib/repositories/types";
import { defaultNotificationPreferences } from "@/lib/domain/notifications";

let snapshot: NotificationPreferenceSnapshot = { ...defaultNotificationPreferences, pushRegistered: false };

export const mockNotificationPreferencesRepository: NotificationPreferencesRepository = {
  async getPreferences() {
    return snapshot;
  },
  async updatePreferences(input: Partial<NotificationPreferences>) {
    snapshot = { ...snapshot, ...input };
    return snapshot;
  },
  async registerPushToken() {
    snapshot = { ...snapshot, pushRegistered: true };
    return snapshot;
  },
  async revokePushToken() {
    snapshot = { ...snapshot, pushRegistered: false };
  },
};
