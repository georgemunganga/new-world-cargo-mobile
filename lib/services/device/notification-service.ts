import { Platform } from "react-native";
import Constants from "expo-constants";
import * as Notifications from "expo-notifications";
import { mobileEnv } from "@/lib/config/env";
import { nativeSuccess, nativeUnavailable, type NativeServiceResult } from "./native-service-result";

export type PushRegistration = {
  token: string;
  provider: "expo" | "apns" | "fcm";
};

export type LocalNotificationInput = {
  title: string;
  body: string;
  data?: Record<string, string>;
};

export const notificationService = {
  async registerForPush(): Promise<NativeServiceResult<PushRegistration>> {
    if (Platform.OS === "web") return nativeUnavailable("browser-preview", "Push notifications are not enabled in the browser preview.");
    const permission = await Notifications.requestPermissionsAsync();
    if (!permission.granted) return nativeUnavailable("permission-denied", "Notifications are turned off. You can still see updates inside the app.");
    try {
      const projectId = mobileEnv.expoProjectId || Constants.expoConfig?.extra?.eas?.projectId || Constants.easConfig?.projectId;
      const token = await Notifications.getExpoPushTokenAsync(projectId ? { projectId } : undefined);
      return nativeSuccess({ token: token.data, provider: "expo" });
    } catch {
      return nativeUnavailable("not-configured", "Push notifications need an Expo project ID before production registration.");
    }
  },
  async scheduleLocalNotification(input: LocalNotificationInput): Promise<NativeServiceResult<{ id: string }>> {
    if (Platform.OS === "web") return nativeUnavailable("browser-preview", "Local notifications are not enabled in the browser preview.");
    const id = await Notifications.scheduleNotificationAsync({
      content: { title: input.title, body: input.body, data: input.data },
      trigger: null,
    });
    return nativeSuccess({ id });
  },
};
