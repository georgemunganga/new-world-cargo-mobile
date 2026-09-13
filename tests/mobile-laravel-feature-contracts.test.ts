import { describe, expect, it } from "vitest";
import { MobileApiError } from "../lib/api/errors";
import { mapPortalShipment } from "../lib/adapters/laravel/portal-shipment-contract";
import { missingPortalContract } from "../lib/adapters/laravel/portal-contract-gap";
import { portalSubmissionPayload } from "../lib/adapters/laravel/laravel-booking-adapter";

describe("mobile Laravel feature contracts", () => {
  it("maps CustomerPortalApi shipment DTOs without leaking Laravel field names to screens", () => {
    expect(mapPortalShipment({
      id: "37726",
      trackingNumber: "EXP-LUN10001",
      packageName: "Sneakers",
      parcelOwner: "George Munganga",
      transportMode: "sea",
      status: "in_transit",
      origin: "China",
      destination: "Lusaka",
      etaLabel: "Sep 20, 2026",
    })).toMatchObject({
      id: "37726",
      code: "EXP-LUN10001",
      title: "George Munganga",
      service: "import",
      status: "in_transit",
      origin: { city: "China" },
      destination: { city: "Lusaka" },
      etaLabel: "Sep 20, 2026",
    });
  });

  it("marks missing Laravel contracts explicitly instead of calling guessed endpoints", () => {
    expect(() => missingPortalContract("Saved payment methods")).toThrow(MobileApiError);
    try {
      missingPortalContract("Saved payment methods");
    } catch (error) {
      expect(error).toBeInstanceOf(MobileApiError);
      expect((error as MobileApiError).code).toBe("CONTRACT_MISSING");
    }
  });

  it("keeps branch ids in booking submissions while preserving route text compatibility", () => {
    expect(portalSubmissionPayload("import", {
      originCity: "Guangzhou",
      originCountry: "China",
      destinationCity: "Lusaka",
      destinationBranchId: "1",
      consignee: { name: "George Munganga", phone: "+260971000000" },
      cargoItems: [{ id: "item-1", name: "Shoes", quantity: 2, weight: 3.5, amount: 42.5 }],
    })).toMatchObject({
      form: {
        pickup: "Guangzhou, China",
        destination: "Lusaka",
        pickupBranchId: "1",
        destinationBranchId: "1",
      },
      cargoRows: [{ name: "Shoes", quantity: 2, weight: 3.5, amount: 42.5 }],
    });
  });
});
