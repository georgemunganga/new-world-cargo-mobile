export type ShipmentStatus = "pending" | "booking_confirmed" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled" | "exception" | "action_required";

export type ShipmentAddress = {
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
