import type { ShipmentStatus } from "@/types/cargo";

export type ReturnReason = "damaged" | "incorrect" | "changed-mind" | "other";
export type ReturnHandover = "courier-pickup" | "collection-point";
/** Matches the portal contract. The server emits requested, approved, in_transit and cancelled. */
export type ReturnRequestStatus =
  | "draft"
  | "requested"
  | "approved"
  | "in_transit"
  | "completed"
  | "rejected"
  | "cancelled";

export const returnStatusPresentation: Record<ReturnRequestStatus, { label: string; tone: "info" | "success" | "warning" | "neutral" }> = {
  draft: { label: "Draft", tone: "neutral" },
  requested: { label: "Requested", tone: "info" },
  approved: { label: "Approved", tone: "info" },
  in_transit: { label: "On its way back", tone: "info" },
  completed: { label: "Completed", tone: "success" },
  rejected: { label: "Not approved", tone: "warning" },
  cancelled: { label: "Cancelled", tone: "neutral" },
};

export type ReturnRequest = {
  id: string;
  shipmentId: string;
  shipmentReference: string;
  reason: ReturnReason;
  handover: ReturnHandover;
  status: ReturnRequestStatus;
  createdLabel: string;
};

export type ReturnableShipmentSummary = {
  id: string;
  reference: string;
  status: ShipmentStatus;
};

export type SubmitReturnRequestInput = {
  shipment: ReturnableShipmentSummary;
  reason: ReturnReason;
  handover: ReturnHandover;
};

export const returnReasons: { id: ReturnReason; label: string; detail: string }[] = [
  { id: "damaged", label: "Item arrived damaged", detail: "Packaging or cargo condition needs review." },
  { id: "incorrect", label: "Incorrect item", detail: "The received cargo does not match the booking." },
  { id: "changed-mind", label: "No longer needed", detail: "You would like to return eligible cargo." },
  { id: "other", label: "Another reason", detail: "Describe this in the support follow-up." },
];

export const returnHandovers: { id: ReturnHandover; label: string; detail: string }[] = [
  { id: "courier-pickup", label: "Courier pickup", detail: "We will confirm an eligible collection window." },
  { id: "collection-point", label: "Drop at collection point", detail: "Take your cargo to a New WorldCargo point." },
];

export function isReturnEligible(shipment: { status: ShipmentStatus }) {
  return shipment.status === "delivered";
}

export function createReturnRequest(input: SubmitReturnRequestInput): ReturnRequest {
  return {
    id: `return-${input.shipment.id}`,
    shipmentId: input.shipment.id,
    shipmentReference: input.shipment.reference,
    reason: input.reason,
    handover: input.handover,
    status: "requested",
    createdLabel: "Just now",
  };
}
