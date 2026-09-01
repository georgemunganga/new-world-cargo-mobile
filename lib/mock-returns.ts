import type { Shipment } from "@/types/cargo";

export type ReturnReason = "damaged" | "incorrect" | "changed-mind" | "other";
export type ReturnHandover = "courier-pickup" | "collection-point";
export type MockReturnRequest = {
  id: string;
  shipmentId: string;
  shipmentReference: string;
  reason: ReturnReason;
  handover: ReturnHandover;
  status: "submitted" | "reviewing" | "approved";
  createdLabel: string;
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

export function isReturnEligible(shipment: Shipment) { return shipment.status === "delivered"; }

export function createMockReturnRequest(shipment: Shipment, reason: ReturnReason, handover: ReturnHandover): MockReturnRequest {
  return { id: `return-${shipment.id}`, shipmentId: shipment.id, shipmentReference: shipment.reference, reason, handover, status: "submitted", createdLabel: "Just now" };
}
