import { PermissionsAndroid, Platform } from "react-native";

export type DevicePermission = "camera" | "contacts" | "location" | "notifications" | "photos" | "files" | "biometrics";
export type DevicePermissionStatus = "granted" | "denied" | "undetermined" | "unavailable";

export type PermissionService = {
  getStatus(permission: DevicePermission): Promise<DevicePermissionStatus>;
  request(permission: DevicePermission): Promise<DevicePermissionStatus>;
};

function normalize(status?: string): DevicePermissionStatus {
  if (status === "granted") return "granted";
  if (status === "denied") return "denied";
  if (status === "undetermined") return "undetermined";
  return "unavailable";
}

function moduleFor(permission: DevicePermission): { get?: () => Promise<{ status?: string }>; request?: () => Promise<{ status?: string }> } | null {
  try {
    if (permission === "location") {
      const location = require("expo-location");
      return { get: location.getForegroundPermissionsAsync, request: location.requestForegroundPermissionsAsync };
    }
    if (permission === "notifications") {
      // POST_NOTIFICATIONS is an API 33+ runtime permission. On older Android the
      // system finishes the grant activity without ever calling back, so
      // PermissionsAndroid.request() never settles and callers hang forever.
      // Below 33 fall through to expo-notifications, which reports the real
      // notifications-enabled state instead.
      if (Platform.OS === "android" && Number(Platform.Version) >= 33) {
        const notificationPermission = PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS;
        return {
          get: async () => ({
            status: await PermissionsAndroid.check(notificationPermission) ? "granted" : "undetermined",
          }),
          request: async () => ({
            status: await PermissionsAndroid.request(notificationPermission) === PermissionsAndroid.RESULTS.GRANTED
              ? "granted"
              : "denied",
          }),
        };
      }
      const notifications = require("expo-notifications");
      return { get: notifications.getPermissionsAsync, request: notifications.requestPermissionsAsync };
    }
    if (permission === "contacts") {
      const contacts = require("expo-contacts");
      return { get: contacts.getPermissionsAsync, request: contacts.requestPermissionsAsync };
    }
    if (permission === "camera" || permission === "photos") {
      const imagePicker = require("expo-image-picker");
      return permission === "camera"
        ? { get: imagePicker.getCameraPermissionsAsync, request: imagePicker.requestCameraPermissionsAsync }
        : { get: imagePicker.getMediaLibraryPermissionsAsync, request: imagePicker.requestMediaLibraryPermissionsAsync };
    }
  } catch {
    return null;
  }
  return null;
}

export const permissionService: PermissionService = {
  async getStatus(permission) {
    if (permission === "files") return "granted";
    if (Platform.OS === "web") return "unavailable";
    const native = moduleFor(permission);
    if (!native?.get) return "unavailable";
    try {
      return normalize((await native.get()).status);
    } catch {
      return "unavailable";
    }
  },
  async request(permission) {
    if (permission === "files") return "granted";
    if (Platform.OS === "web") return "unavailable";
    const native = moduleFor(permission);
    if (!native?.request) return "unavailable";
    try {
      return normalize((await native.request()).status);
    } catch {
      return "unavailable";
    }
  },
};
