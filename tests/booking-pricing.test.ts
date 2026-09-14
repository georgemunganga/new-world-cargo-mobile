import { describe, expect, it } from "vitest";
import { bookingQuoteRequestFromDraft, fallbackBookingQuote } from "../lib/booking-pricing";

describe("booking pricing contract", () => {
  it("builds Ntumai-style local pricing params from selected route pins", () => {
    const request = bookingQuoteRequestFromDraft("local", {
      pickup: { city: "Lusaka", area: "Roma", detail: "Roma", latitude: -15.3665, longitude: 28.3206 },
      destination: { city: "Lusaka", area: "Longacres", detail: "Longacres", latitude: -15.4162, longitude: 28.3074 },
      vehicle: "small_van",
      schedule: "later_today",
      cargoItems: [{ id: "item-1", name: "Documents", quantity: 1, weight: 2, amount: 100 }],
    });

    expect(request).toMatchObject({
      service: "local",
      bookingType: "local_delivery",
      vehicleType: "small_van",
      schedule: "later_today",
      pickup: { city: "Lusaka", area: "Roma", latitude: -15.3665, longitude: 28.3206 },
      destination: { city: "Lusaka", area: "Longacres", latitude: -15.4162, longitude: 28.3074 },
      cargo: { totalWeight: 2, declaredValue: 100, fragile: false },
    });
    expect(request.distanceKm).toBeGreaterThan(0);
  });

  it("marks local fallback quotes as unsigned development estimates", () => {
    const quote = fallbackBookingQuote(bookingQuoteRequestFromDraft("local", {
      pickup: { city: "Lusaka", area: "Roma", detail: "Roma", latitude: -15.3665, longitude: 28.3206 },
      destination: { city: "Lusaka", area: "Longacres", detail: "Longacres", latitude: -15.4162, longitude: 28.3074 },
      vehicle: "scooter",
    }));

    expect(quote).toMatchObject({ source: "fallback", currency: "ZMW" });
    expect(quote.quoteSignature).toBeUndefined();
    expect(quote.total).toBeGreaterThan(0);
  });
});
