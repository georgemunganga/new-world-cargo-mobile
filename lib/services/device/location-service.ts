import { Platform } from "react-native";
import { readablePlaceLabel } from "@/lib/maps/place-label";
import { nativeSuccess, nativeUnavailable, type NativeServiceResult } from "./native-service-result";

export type DeviceLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

type ExpoLocationModule = {
  reverseGeocodeAsync?: (point: { latitude: number; longitude: number }) => Promise<{ city?: string | null; district?: string | null; subregion?: string | null; street?: string | null; streetNumber?: string | null; name?: string | null; isoCountryCode?: string | null }[]>;
  requestForegroundPermissionsAsync?: () => Promise<{ status: string }>;
  getCurrentPositionAsync?: (options?: { accuracy?: unknown }) => Promise<{ coords: { latitude: number; longitude: number; accuracy?: number | null } }>;
  Accuracy?: { Balanced?: unknown; High?: unknown };
};

function loadExpoLocation(): ExpoLocationModule | null {
  try {
    // Optional native dependency so tests/web preview can run without a native runtime.
     
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require("expo-location") as ExpoLocationModule;
  } catch {
    return null;
  }
}

export const locationService = {
  async getCurrentAddress() {
    const result = await locationService.getCurrentLocation();
    if (!result.ok) throw new Error(result.message);
    return locationService.addressForCoordinate(result.value, "Current location");
  },
  async addressForCoordinate(point: DeviceLocation, fallback = "Selected location") {
    const Location = loadExpoLocation();
    const addresses = await Location?.reverseGeocodeAsync?.(point);
    const address = addresses?.[0];
    if (address?.isoCountryCode?.toUpperCase() !== "ZM") throw new Error("Local delivery is available in Zambia. Enable location and try again while in Zambia.");
    const resolvedCity = address.city?.trim() || address.subregion?.trim();
    if (!resolvedCity) throw new Error("We could not identify your city. Check location services and try again.");
    return { ...point, city: resolvedCity, cityDistrict: address.subregion?.trim() || undefined, area: address.district || resolvedCity,
      detail: readablePlaceLabel({ ...address, city: resolvedCity }, fallback) };
  },
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
