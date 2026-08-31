import type { Address, Shipment, ShipmentStatus } from "@/types/cargo";

export const savedPlaces: Address[] = [
  { label: "Home", city: "Lusaka", area: "Roma", detail: "Plot 27, Great East Road" },
  { label: "Work", city: "Lusaka", area: "Longacres", detail: "Cairo Road business district" },
  { label: "Branch", city: "Lusaka", area: "Kabwata", detail: "New WorldCargo collection point" },
];

export const shipments: Shipment[] = [
  {
    id: "nwc-24518",
    reference: "NWC-24518",
    service: "local",
    status: "out_for_delivery",
    title: "Office supplies",
    pickup: { city: "Lusaka", area: "Longacres", detail: "Cairo Road business district" },
    destination: { city: "Lusaka", area: "Roma", detail: "Plot 27, Great East Road" },
    eta: "Today, 15:30–16:15",
    dateLabel: "Out for delivery",
    actionLabel: "Track shipment",
  },
  {
    id: "nwc-24206",
    reference: "NWC-24206",
    service: "intercity",
    status: "in_transit",
    title: "Two cartons",
    pickup: { city: "Lusaka", area: "Kabwata", detail: "New WorldCargo collection point" },
    destination: { city: "Ndola", area: "Town Centre", detail: "Receiver collection point" },
    eta: "Expected tomorrow",
    dateLabel: "In transit",
  },
  {
    id: "nwc-23990",
    reference: "NWC-23990",
    service: "import",
    status: "action_required",
    title: "Homeware order",
    pickup: { city: "Guangzhou", area: "Baiyun", detail: "New WorldCargo warehouse" },
    destination: { city: "Lusaka", area: "Kabwata", detail: "Collection branch" },
    eta: "Final price ready",
    dateLabel: "Payment required",
    actionLabel: "View bill",
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
};

export const billingSummary = {
  walletLabel: "Cargo wallet",
  amountDue: "K 1,280.00",
  dueLabel: "1 bill needs your attention",
};
