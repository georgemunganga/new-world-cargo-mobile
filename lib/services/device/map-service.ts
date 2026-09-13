import type { DeviceLocation } from "./location-service";
import { nativeSuccess, type NativeServiceResult } from "./native-service-result";

export type MapProvider = "mock" | "native";

export type MapRoutePoint = DeviceLocation & {
  label: string;
};

export type MapRoutePreview = {
  provider: MapProvider;
  origin: MapRoutePoint;
  destination: MapRoutePoint;
  distanceLabel: string;
  durationLabel: string;
};

export const mapService = {
  async previewRoute(origin: MapRoutePoint, destination: MapRoutePoint): Promise<NativeServiceResult<MapRoutePreview>> {
    return nativeSuccess({
      provider: "mock",
      origin,
      destination,
      distanceLabel: "To be calculated by map provider",
      durationLabel: "ETA pending provider",
    });
  },
};
