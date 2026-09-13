import { nativeUnavailable, type NativeServiceResult } from "./native-service-result";

export type DeviceLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

export const locationService = {
  async getCurrentLocation(): Promise<NativeServiceResult<DeviceLocation>> {
    return nativeUnavailable("missing-native-module", "Location is ready at the app seam. Add the native location module before production builds.");
  },
};
