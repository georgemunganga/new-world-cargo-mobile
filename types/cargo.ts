export type ServiceType = "import" | "intercity" | "local";
export type ShipmentStatus =
  | "action_required"
  | "booking_confirmed"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "pending";
export type BookingStep = "route" | "parcel" | "contacts" | "schedule" | "review";

export type Address = {
  label?: string;
  city: string;
  area: string;
  detail: string;
};

export type PersonContact = {
  name: string;
  phone: string;
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
};

export type LocalDeliveryDraft = {
  service: "local";
  step: BookingStep;
  pickup?: Address;
  destination?: Address;
  parcelCategory?: string;
  parcelDescription?: string;
  quantity?: number;
  handling?: "standard" | "fragile";
  sender?: PersonContact;
  receiver?: PersonContact;
  deliveryInstructions?: string;
  schedule?: "as_soon_as_possible" | "later_today" | "scheduled";
};
