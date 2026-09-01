import { CustomerMap, type MapPinPosition } from "@/components/map/customer-map";
import type { Address } from "@/types/cargo";

export type PickupPinPosition = MapPinPosition;

export function LocalDeliveryMapBackdrop({ pickup, destination, pickupPinPosition = "initial", destinationPinPosition = "initial", adjustingTarget, routeReady = false }: { pickup?: Address; destination?: Address; pickupPinPosition?: PickupPinPosition; destinationPinPosition?: PickupPinPosition; adjustingTarget?: "pickup" | "destination" | null; routeReady?: boolean }) {
  return <CustomerMap fill mode={routeReady ? "route-preview" : "location-picker"} pickup={pickup} destination={destination} pickupPinPosition={pickupPinPosition} destinationPinPosition={destinationPinPosition} adjustingTarget={adjustingTarget} routeReady={routeReady} />;
}
