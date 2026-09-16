/**
 * Mirrors the CustomerPortalApi contract exactly (the same set the web portal
 * validates). The server currently emits pending, in_transit, at_destination,
 * delivered, cancelled and failed; the rest are accepted so a new operational
 * state never silently falls through to "pending".
 */
export type ShipmentStatus =
  | "pending"
  | "pickup_scheduled"
  | "picked_up"
  | "in_transit"
  | "at_destination"
  | "out_for_delivery"
  | "delivered"
  | "delayed"
  | "failed"
  | "cancelled";

/** Actions the server says are valid for this shipment right now. */
export type ShipmentAction =
  | "pay"
  | "cancel"
  | "duplicate"
  | "schedule_pickup"
  | "reschedule_pickup"
  | "cancel_pickup"
  | "edit_delivery"
  | "reschedule_delivery"
  | "collect_from_depot"
  | "report_issue";

export type ShipmentAddress = {
  latitude?: number;
  longitude?: number;
  label?: string;
  city: string;
  area?: string;
  detail?: string;
};

export type ShipmentTrackingContact = {
  name: string;
  role: string;
  phone: string;
  rating?: string;
  verified?: boolean;
};

export type ShipmentTrackingProgress = {
  distanceLabel: string;
  pickupTime: string;
  arrivalTime: string;
  fraction: number;
  mapLabel: string;
  stages: string[];
};

export type ShipmentTrackingEvent = {
  id: string;
  label: string;
  detail: string;
  occurredAt?: string;
  displayTime: string;
  state: "complete" | "current" | "upcoming";
};

export type CustomerShipment = {
  /** Shared handover secret. Present only on customer-scoped reads. */
  confirmationCode?: string;
  /** Server-supplied label, e.g. "Approved" while status is still "pending". */
  statusLabel?: string;
  /** Server-calculated. Never infer availability from status locally. */
  allowedActions?: ShipmentAction[];
  id: string;
  code: string;
  title: string;
  service: "import" | "intercity" | "local" | "custom";
  status: ShipmentStatus;
  origin: ShipmentAddress;
  destination: ShipmentAddress;
  etaLabel?: string;
  dateLabel?: string;
  actionLabel?: string;
  trackingContact?: ShipmentTrackingContact;
  trackingProgress?: ShipmentTrackingProgress;
  trackingEvents?: ShipmentTrackingEvent[];
  updatedAt?: string;
  revision?: number;
  amountDue?: string;
  branchId?: string;
};
