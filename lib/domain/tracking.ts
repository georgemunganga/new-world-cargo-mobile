import type { CustomerShipment } from "./shipment";

export type TrackingEvent = {
  id: string;
  label: string;
  detail?: string;
  happenedAt?: string;
  location?: string;
  completed: boolean;
};

export type TrackingResult =
  | { kind: "found"; shipment: CustomerShipment; events: TrackingEvent[] }
  | { kind: "not-found"; message: string }
  | { kind: "unavailable"; message: string; retryable: boolean };

export function normaliseTrackingCode(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "");
}
