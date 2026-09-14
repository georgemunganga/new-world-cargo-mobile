import type { DeviceLocation } from "./location-service";
import { deliveryMapProfileFor, type DeliveryMapService } from "@/lib/domain/delivery-map";
import { nativeSuccess, type NativeServiceResult } from "./native-service-result";

export type MapProvider = "mock" | "native";

export type MapRoutePoint = DeviceLocation & {
  label: string;
};

export type MapRoutePreview = {
  provider: MapProvider;
  service: DeliveryMapService;
  origin: MapRoutePoint;
  destination: MapRoutePoint;
  distanceLabel: string;
  durationLabel: string;
};

export const mapService = {
  async previewRoute(origin: MapRoutePoint, destination: MapRoutePoint, service: DeliveryMapService = "local"): Promise<NativeServiceResult<MapRoutePreview>> {
    const profile = deliveryMapProfileFor(service);
    return nativeSuccess({
      provider: "mock",
      service: profile.service,
      origin,
      destination,
      distanceLabel: profile.distanceLabel,
      durationLabel: profile.durationLabel,
    });
  },
};
