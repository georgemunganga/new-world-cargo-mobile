import { describe, expect, it } from "vitest";
import { MobileApiError } from "../lib/api/errors";
import { mapPortalShipment } from "../lib/adapters/laravel/portal-shipment-contract";
import { missingPortalContract } from "../lib/adapters/laravel/portal-contract-gap";
import { portalSubmissionPayload } from "../lib/adapters/laravel/laravel-booking-adapter";

describe("mobile Laravel feature contracts", () => {
  it("includes the requested pickup instant in both pricing and submission", () => {
    const scheduledAt = "2026-09-16T08:30:00.000Z";
    const payload = portalSubmissionPayload("local", { schedule: "scheduled", scheduledAt });
    expect(payload.form).toMatchObject({ schedule: "scheduled", scheduledAt });
    expect(payload.pricing.request).toMatchObject({ schedule: "scheduled", scheduledAt });
    expect(portalSubmissionPayload("local", { schedule: "as_soon_as_possible", scheduledAt }).form).not.toHaveProperty("scheduledAt");
  });
  it("leaves an unknown international supplier empty instead of copying receiver details", () => {
    const payload = portalSubmissionPayload("import", { consignee: { name: "Receiver", phone: "+260971234567" } });
    expect(payload.form).toMatchObject({ recipient: "Receiver", phone: "+260971234567", sender: "", senderPhone: "" });
  });
  it("keeps optional supplier contact data separate from the international receiver", () => {
    const supplier = { name: "Supplier", phone: "+8613812345678", company: "Test supplier company", email: "supplier@example.com", notes: "Warehouse contact" };
    const payload = portalSubmissionPayload("import", { consignee: { name: "Receiver", phone: "+260971234567" }, supplier });
    expect(payload.form).toMatchObject({ recipient: "Receiver", sender: supplier.name, senderPhone: supplier.phone, supplierCompany: supplier.company, supplierEmail: supplier.email, supplierNotes: supplier.notes });
    expect(payload.draft).toMatchObject({ supplier });
  });
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
      progress: 55,
      updatedAt: "2026-09-14T06:00:00Z",
      events: [{ id: "stage-1", label: "Picked up", detail: "Lusaka depot", displayTime: "Sep 14, 2026 8:00 AM", complete: true }],
    })).toMatchObject({
      id: "37726",
      code: "EXP-LUN10001",
      title: "George Munganga",
      service: "import",
      status: "in_transit",
      origin: { city: "China" },
      destination: { city: "Lusaka" },
      etaLabel: "Sep 20, 2026",
      trackingProgress: { fraction: 0.55 },
      trackingEvents: [{ id: "stage-1", label: "Picked up", state: "complete" }],
      updatedAt: "2026-09-14T06:00:00Z",
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
      originLatitude: 23.1291,
      originLongitude: 113.2644,
      destinationLatitude: -15.3875,
      destinationLongitude: 28.3228,
      quote: { source: "server", currency: "ZMW", total: 2450, formattedTotal: "K 2,450", quotePayload: { total: 2450 }, quoteSignature: "signed-quote" },
      consignee: { name: "George Munganga", phone: "+260971000000" },
      cargoItems: [{ id: "item-1", name: "Shoes", quantity: 2, weight: 3.5, amount: 42.5 }],
    })).toMatchObject({
      form: {
        pickup: "Guangzhou, China",
        destination: "Lusaka",
        pickupBranchId: undefined,
        destinationBranchId: "1",
        pickupLatitude: 23.1291,
        pickupLongitude: 113.2644,
        destinationLatitude: -15.3875,
        destinationLongitude: 28.3228,
      },
      pricing: {
        request: {
          bookingType: "international_import",
          transportMode: undefined,
          receivingHub: { branchId: "1" },
          onwardDelivery: "collection",
          cargo: { totalWeight: 7, declaredValue: 85, packageType: "standard" },
        },
        quotePayload: { total: 2450 },
        quoteSignature: "signed-quote",
        quoteSource: "server",
      },
      cargoRows: [{ name: "Shoes", quantity: 2, weight: 3.5, amount: 42.5 }],
    });
  });
});
