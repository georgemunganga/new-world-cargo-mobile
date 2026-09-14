import { Platform } from "react-native";

export type DevicePermission = "camera" | "location" | "notifications" | "photos" | "files" | "biometrics";
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
      const notifications = require("expo-notifications");
      return { get: notifications.getPermissionsAsync, request: notifications.requestPermissionsAsync };
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
