export type ServiceType = "import" | "intercity" | "local";
export type ShippingMethod = "air" | "sea";
export type ShipmentStatus =
  | "action_required"
  | "booking_confirmed"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "pending";
export type BookingStep = "route" | "parcel" | "contacts" | "schedule" | "review";
export type LocalDeliveryVehicle = "scooter" | "small_van" | "cargo_van";

export type Address = {
  label?: string;
  branchId?: string;
  city: string;
  area: string;
  detail: string;
};

export type PersonContact = {
  name: string;
  phone: string;
};

export type BookingCargoItem = {
  id: string;
  name: string;
  quantity: number;
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

export type Shipment = {
  id: string;
  reference: string;
  service: ServiceType;
  status: ShipmentStatus;
  title: string;
  pickup: Address;
  destination: Address;
  eta: string;
  dateLabel: string;
  actionLabel?: string;
  trackingContact?: TrackingContact;
  trackingProgress?: TrackingProgress;
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
  vehicle?: LocalDeliveryVehicle;
};

export type ImportBookingDraft = {
  service: "import";
  method?: ShippingMethod;
  originCountry?: string;
  originCity?: string;
  originBranchId?: string;
  destinationCity?: string;
  destinationBranchId?: string;
  cargoCategory?: string;
  cargoDescription?: string;
  quantity?: number;
  cargoItems?: BookingCargoItem[];
  cargoPhotos?: BookingCargoAttachment[];
  supportingDocument?: BookingCargoAttachment;
  consignee?: PersonContact;
};

export type IntercityBookingDraft = {
  service: "intercity";
  originCity?: string;
  originBranchId?: string;
  destinationCity?: string;
  destinationBranchId?: string;
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
};
