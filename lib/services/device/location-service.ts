import { Platform } from "react-native";
import { nativeSuccess, nativeUnavailable, type NativeServiceResult } from "./native-service-result";

export type DeviceLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

type ExpoLocationModule = {
  requestForegroundPermissionsAsync?: () => Promise<{ status: string }>;
  getCurrentPositionAsync?: (options?: { accuracy?: unknown }) => Promise<{ coords: { latitude: number; longitude: number; accuracy?: number | null } }>;
  Accuracy?: { Balanced?: unknown; High?: unknown };
};

function loadExpoLocation(): ExpoLocationModule | null {
  try {
    // Optional native dependency so tests/web preview can run without a native runtime.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    return require("expo-location") as ExpoLocationModule;
  } catch {
    return null;
  }
}

export const locationService = {
  async getCurrentLocation(): Promise<NativeServiceResult<DeviceLocation>> {
    if (Platform.OS === "web") {
      return nativeUnavailable("browser-preview", "Current location is available on iOS and Android. Enter the location manually on web.");
    }

    const Location = loadExpoLocation();
    if (!Location?.requestForegroundPermissionsAsync || !Location.getCurrentPositionAsync) {
      return nativeUnavailable("missing-native-module", "Location is not installed in this build yet.");
    }

    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== "granted") {
      return nativeUnavailable("permission-denied", "Location permission was not granted.");
    }

    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy?.Balanced });
    return nativeSuccess({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      accuracy: position.coords.accuracy ?? undefined,
    });
  },
};
