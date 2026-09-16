import { describe, expect, it } from "vitest";
import { mockReturnRequestRepository } from "../lib/adapters/mock/mock-return-request-adapter";
import { createReturnRequest, isReturnEligible } from "../lib/domain/return-request";

const deliveredShipment = { id: "shipment-1", reference: "EXP-LUN10001", status: "delivered" as const };
const activeShipment = { id: "shipment-2", reference: "EXP-LUN10002", status: "in_transit" as const };

describe("mobile return request repository", () => {
  it("keeps return eligibility tied to delivered shipments", () => {
    expect(isReturnEligible(deliveredShipment)).toBe(true);
    expect(isReturnEligible(activeShipment)).toBe(false);
  });

  it("creates a requested return request from a shipment summary", () => {
    const request = createReturnRequest({ shipment: deliveredShipment, reason: "damaged", handover: "courier-pickup" });

    expect(request).toMatchObject({ shipmentId: "shipment-1", shipmentReference: "EXP-LUN10001", status: "requested" });
  });

  it("submits and replaces one return request per shipment", async () => {
    await mockReturnRequestRepository.submitReturn({ shipment: deliveredShipment, reason: "damaged", handover: "courier-pickup" });
    const updated = await mockReturnRequestRepository.submitReturn({ shipment: deliveredShipment, reason: "other", handover: "collection-point" });
    const requests = await mockReturnRequestRepository.listRequests();

    expect(updated.reason).toBe("other");
    expect(requests.filter((item) => item.shipmentId === deliveredShipment.id)).toHaveLength(1);
  });
});
