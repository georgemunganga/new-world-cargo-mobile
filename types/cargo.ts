export type ServiceType = "import" | "intercity" | "local";
export type ShippingMethod = "air" | "sea";
// Imported and re-exported so the UI and the domain can never diverge again.
import type { ShipmentStatus } from "@/lib/domain/shipment";
export type { ShipmentStatus };
export type BookingStep = "route" | "parcel" | "contacts" | "schedule" | "review";
export type LocalDeliveryVehicle = "scooter" | "small_van" | "cargo_van";

export type BookingQuote = {
  source: "server" | "fallback";
  currency: string;
  total: number;
  formattedTotal: string;
  distanceKm?: number;
  estimatedDurationMinutes?: number;
  expiresAt?: string;
  quotePayload?: Record<string, unknown>;
  quoteSignature?: string;
  breakdown?: Record<string, unknown>;
};

export type Address = {
  cityDistrict?: string;
  label?: string;
  branchId?: string;
  city: string;
  area: string;
  detail: string;
  latitude?: number;
  longitude?: number;
};

export type PersonContact = {
  name: string;
  phone: string;
};

export type BookingCargoItem = {
  id: string;
  name: string;
  quantity: number;
  weight?: number;
  amount?: number;
};

export type BookingCargoAttachment = {
  id: string;
  name: string;
  kind: "photo" | "supporting_document";
  uri?: string;
  type?: string;
  size?: number;
};

export type TrackingContact = {
  name: string;
  role: string;
  phone: string;
  rating?: string;
  verified?: boolean;
};

export type TrackingProgress = {
  distanceLabel: string;
  pickupTime: string;
  arrivalTime: string;
  fraction: number;
  mapLabel: string;
  stages: string[];
};

export type TrackingEvent = {
  id: string;
  label: string;
  detail: string;
  occurredAt?: string;
  displayTime: string;
  state: "complete" | "current" | "upcoming";
};

export type Shipment = {
  id: string;
  reference: string;
  service: ServiceType;
  status: ShipmentStatus;
  statusLabel?: string;
  title: string;
  pickup: Address;
  destination: Address;
  eta: string;
  dateLabel: string;
  actionLabel?: string;
  trackingContact?: TrackingContact;
  trackingProgress?: TrackingProgress;
  trackingEvents?: TrackingEvent[];
  updatedAt?: string;
  revision?: number;
};

export type LocalDeliveryDraft = {
  service: "local";
  step: BookingStep;
  pickup?: Address;
  destination?: Address;
  parcelCategory?: string;
  parcelDescription?: string;
  quantity?: number;
  cargoItems?: BookingCargoItem[];
  cargoDescription?: string;
  cargoPhotos?: BookingCargoAttachment[];
  supportingDocument?: BookingCargoAttachment;
  handling?: "standard" | "fragile";
  sender?: PersonContact;
  receiver?: PersonContact;
  deliveryInstructions?: string;
  schedule?: "as_soon_as_possible" | "later_today" | "scheduled";
  scheduledAt?: string;
  vehicle?: LocalDeliveryVehicle;
  quote?: BookingQuote;
};

export type ImportBookingDraft = {
  supplier?: PersonContact & { company?: string; email?: string; notes?: string };
  service: "import";
  method?: ShippingMethod;
  originCountry?: string;
  originCity?: string;
  originBranchId?: string;
  originLatitude?: number;
  originLongitude?: number;
  destinationCity?: string;
  destinationBranchId?: string;
  destinationLatitude?: number;
  destinationLongitude?: number;
  cargoCategory?: string;
  cargoDescription?: string;
  quantity?: number;
  cargoItems?: BookingCargoItem[];
  cargoPhotos?: BookingCargoAttachment[];
  supportingDocument?: BookingCargoAttachment;
  consignee?: PersonContact;
  quote?: BookingQuote;
};

export type IntercityBookingDraft = {
  service: "intercity";
  originCity?: string;
  originBranchId?: string;
  originLatitude?: number;
  originLongitude?: number;
  destinationCity?: string;
  destinationBranchId?: string;
  destinationLatitude?: number;
  destinationLongitude?: number;
  cargoCategory?: string;
  quantity?: number;
  cargoItems?: BookingCargoItem[];
  cargoDescription?: string;
  cargoPhotos?: BookingCargoAttachment[];
  supportingDocument?: BookingCargoAttachment;
  sender?: PersonContact;
  receiver?: PersonContact;
  fulfilment?: "collection" | "door_delivery";
  schedule?: "next_available" | "scheduled";
  quote?: BookingQuote;
};

export type CustomRequestDraft = {
  service: "custom";
  pickup?: Address;
  destination?: Address;
  requestType?: string;
  requestDetail?: string;
  cargoItems?: BookingCargoItem[];
  cargoDescription?: string;
  cargoPhotos?: BookingCargoAttachment[];
  supportingDocument?: BookingCargoAttachment;
  contact?: PersonContact;
  quote?: BookingQuote;
};
