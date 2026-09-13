import { describe, expect, it } from "vitest";
import { MobileApiError } from "../lib/api/errors";
import { mapPortalShipment } from "../lib/adapters/laravel/portal-shipment-contract";
import { missingPortalContract } from "../lib/adapters/laravel/portal-contract-gap";

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
});
