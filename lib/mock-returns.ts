import { createReturnRequest, isReturnEligible, returnHandovers, returnReasons, type ReturnHandover, type ReturnReason, type ReturnRequest } from "@/lib/domain/return-request";
import type { Shipment } from "@/types/cargo";

export type MockReturnRequest = ReturnRequest;
export type { ReturnHandover, ReturnReason };
export { isReturnEligible, returnHandovers, returnReasons };

export function createMockReturnRequest(shipment: Shipment, reason: ReturnReason, handover: ReturnHandover): MockReturnRequest {
  return createReturnRequest({ shipment, reason, handover });
}
