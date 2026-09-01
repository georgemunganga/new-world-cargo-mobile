import type { Address, Shipment, ShipmentStatus } from "@/types/cargo";

export const savedPlaces: Address[] = [
  { label: "Home", city: "Lusaka", area: "Roma", detail: "Plot 27, Great East Road" },
  { label: "Work", city: "Lusaka", area: "Longacres", detail: "Cairo Road business district" },
  { label: "Branch", city: "Lusaka", area: "Kabwata", detail: "New WorldCargo collection point" },
];

export const shipments: Shipment[] = [
  {
    id: "nwc-24518",
    reference: "NWC-784512",
    service: "import",
    status: "in_transit",
    title: "International cargo",
    pickup: { city: "China", area: "Guangzhou", detail: "New WorldCargo origin warehouse" },
    destination: { city: "Zambia", area: "Lusaka", detail: "New WorldCargo collection branch" },
    eta: "Estimated 14 Sep",
    dateLabel: "In transit",
    actionLabel: "Track shipment",
    trackingContact: { name: "Naomi Phiri", role: "New WorldCargo shipment agent", phone: "+260 970 020 190", rating: "4.8", verified: true },
    trackingProgress: { distanceLabel: "International transit", pickupTime: "30 Aug", arrivalTime: "14 Sep", fraction: 0.54, mapLabel: "Guangzhou to Lusaka route", stages: ["Origin warehouse", "Exported", "International transit", "Zambia warehouse"] },
  },
  {
    id: "nwc-24206",
    reference: "NWC-784210",
    service: "intercity",
    status: "delivered",
    title: "Two cartons",
    pickup: { city: "Lusaka", area: "Kabwata", detail: "New WorldCargo collection point" },
    destination: { city: "Johannesburg", area: "Gauteng", detail: "Receiver delivery address" },
    eta: "Delivered 28 Aug",
    dateLabel: "Delivered",
  },
  {
    id: "nwc-23990",
    reference: "NWC-784089",
    service: "import",
    status: "pending",
    title: "Homeware order",
    pickup: { city: "Dubai", area: "Jebel Ali", detail: "New WorldCargo consolidation point" },
    destination: { city: "Lusaka", area: "Kabwata", detail: "Collection branch" },
    eta: "Pending confirmation",
    dateLabel: "Pending",
    trackingContact: { name: "Import support", role: "New WorldCargo support agent", phone: "+260 970 020 190", verified: true },
    trackingProgress: { distanceLabel: "Confirmation pending", pickupTime: "Awaiting", arrivalTime: "To confirm", fraction: 0.12, mapLabel: "Dubai to Lusaka route", stages: ["Order confirmed", "Supplier received", "International transit", "Lusaka branch"] },
  },
  {
    id: "nwc-23411",
    reference: "NWC-23411",
    service: "local",
    status: "delivered",
    title: "Document envelope",
    pickup: { city: "Lusaka", area: "Woodlands", detail: "Sender address" },
    destination: { city: "Lusaka", area: "Rhodes Park", detail: "Receiver address" },
    eta: "Delivered 18 Aug",
    dateLabel: "Delivered",
  },
];

export const statusPresentation: Record<ShipmentStatus, { label: string; tone: "info" | "success" | "warning" | "neutral"; icon: string }> = {
  action_required: { label: "Action required", tone: "warning", icon: "alert-circle-outline" },
  booking_confirmed: { label: "Booking confirmed", tone: "info", icon: "check-circle-outline" },
  in_transit: { label: "In transit", tone: "info", icon: "truck-fast-outline" },
  out_for_delivery: { label: "Out for delivery", tone: "info", icon: "map-marker-path" },
  delivered: { label: "Delivered", tone: "success", icon: "package-variant-closed-check" },
  pending: { label: "Pending", tone: "info", icon: "clock-outline" },
};

export const billingSummary = {
  walletLabel: "Cargo wallet",
  amountDue: "K 1,280.00",
  dueLabel: "1 bill needs your attention",
};
