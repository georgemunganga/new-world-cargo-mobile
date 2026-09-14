import type { ServiceType } from "@/types/cargo";

export type DeliveryMapService = ServiceType | "custom";
export type DeliveryMapMode = "location-picker" | "route-preview" | "live-local" | "international" | "completed";

export type DeliveryMapProfile = {
  service: DeliveryMapService;
  label: string;
  accessibility: string;
  originFallback: string;
  destinationFallback: string;
  vehicleIcon: string;
  routeStyle: "city" | "intercity" | "international";
  defaultProgress: number;
  distanceLabel: string;
  durationLabel: string;
};

const serviceProfiles: Record<DeliveryMapService, Omit<DeliveryMapProfile, "service">> = {
  local: {
    label: "Local delivery map",
    accessibility: "Local delivery map showing pickup, destination, route progress, and courier movement inside the city.",
    originFallback: "Pickup",
    destinationFallback: "Drop-off",
    vehicleIcon: "bike-fast",
    routeStyle: "city",
    defaultProgress: 0.38,
    distanceLabel: "Local distance pending map provider",
    durationLabel: "Local ETA pending map provider",
  },
  intercity: {
    label: "City-to-City map",
    accessibility: "City-to-City delivery map showing origin city, destination city, and cargo movement between hubs.",
    originFallback: "Origin city",
    destinationFallback: "Destination city",
    vehicleIcon: "truck-fast-outline",
    routeStyle: "intercity",
    defaultProgress: 0.46,
    distanceLabel: "Intercity distance pending map provider",
    durationLabel: "Line-haul ETA pending map provider",
  },
  import: {
    label: "International route map",
    accessibility: "International shipment map showing overseas origin, Zambia destination, and cargo movement across regions.",
    originFallback: "Supplier origin",
    destinationFallback: "Receiving city",
    vehicleIcon: "package-variant-closed",
    routeStyle: "international",
    defaultProgress: 0.42,
    distanceLabel: "International lane pending carrier data",
    durationLabel: "Transit window pending carrier data",
  },
  custom: {
    label: "Custom route map",
    accessibility: "Custom request map showing origin, destination, and route context for the cargo team.",
    originFallback: "Origin",
    destinationFallback: "Destination",
    vehicleIcon: "arrow-top-right",
    routeStyle: "intercity",
    defaultProgress: 0.4,
    distanceLabel: "Route distance pending review",
    durationLabel: "ETA pending review",
  },
};

export function inferDeliveryMapService(service?: DeliveryMapService, mode?: DeliveryMapMode): DeliveryMapService {
  if (service) return service;
  if (mode === "international") return "import";
  if (mode === "live-local" || mode === "location-picker" || mode === "route-preview") return "local";
  return "intercity";
}

export function deliveryMapProfileFor(service?: DeliveryMapService, mode?: DeliveryMapMode): DeliveryMapProfile {
  const resolved = inferDeliveryMapService(service, mode);
  return { service: resolved, ...serviceProfiles[resolved] };
}

export function deliveryMapModeForService(service: DeliveryMapService, routeReady = false): DeliveryMapMode {
  if (service === "import") return "international";
  return routeReady ? "route-preview" : "location-picker";
}
