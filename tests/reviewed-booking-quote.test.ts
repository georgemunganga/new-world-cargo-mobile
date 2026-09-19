import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "../lib/api/client";
import {
  bookingQuoteRequestFromDraft,
  estimateBookingQuote,
  requireReviewedQuote,
} from "../lib/booking-pricing";
import { laravelBookingRepository } from "../lib/adapters/laravel/laravel-booking-adapter";
import type { BookingQuote } from "../types/cargo";

vi.mock("../lib/api/client", () => ({ apiClient: { post: vi.fn() } }));

const draft = {
  pickup: {
    city: "Lusaka",
    area: "Roma",
    detail: "Roma",
    latitude: -15.36,
    longitude: 28.32,
  },
  destination: {
    city: "Lusaka",
    area: "CBD",
    detail: "CBD",
    latitude: -15.41,
    longitude: 28.28,
  },
  vehicle: "scooter",
  cargoItems: [{ id: "1", name: "Parcel", quantity: 1 }],
};
function quote(): BookingQuote {
  return {
    source: "server",
    currency: "USD",
    total: 12.5,
    formattedTotal: "USD 12.50",
    expiresAt: new Date(Date.now() + 900_000).toISOString(),
    quotePayload: { total: 12.5, currency: "USD", quoteId: "1" },
    quoteSignature: "signed",
    requestKey: JSON.stringify(bookingQuoteRequestFromDraft("local", draft)),
  };
}
beforeEach(() => vi.resetAllMocks());

describe("reviewed server quotes", () => {
  it("submits the displayed signed quote without requesting a replacement price", async () => {
    const reviewed = quote();
    vi.mocked(apiClient.post)
      .mockResolvedValueOnce({ data: { id: "draft-1" } })
      .mockResolvedValueOnce({ data: { id: "1", trackingNumber: "NWC00001" } });
    await laravelBookingRepository.submitBooking({
      service: "local",
      draft: { ...draft, quote: reviewed },
    });
    expect(apiClient.post).toHaveBeenCalledTimes(2);
    expect(apiClient.post).toHaveBeenNthCalledWith(
      1,
      "/api/v1/shipment-drafts",
      expect.objectContaining({
        payload: expect.objectContaining({
          pricing: expect.objectContaining({
            quote: reviewed,
            quoteSignature: "signed",
          }),
        }),
      }),
    );
    expect(apiClient.post).toHaveBeenNthCalledWith(
      2,
      "/api/v1/shipment-drafts/draft-1/submit",
      {},
    );
  });

  it.each(["missing", "expired", "changed", "unsigned", "currency"])(
    "blocks %s quotes before creating a draft",
    async (kind) => {
      const reviewed = quote();
      if (kind === "expired")
        reviewed.expiresAt = new Date(Date.now() - 1).toISOString();
      if (kind === "unsigned") reviewed.quoteSignature = undefined;
      if (kind === "currency") reviewed.currency = "ZMW";
      await expect(
        laravelBookingRepository.submitBooking({
          service: "local",
          draft: {
            ...draft,
            vehicle: kind === "changed" ? "cargo_van" : draft.vehicle,
            quote: kind === "missing" ? undefined : reviewed,
          },
        }),
      ).rejects.toMatchObject({ code: "QUOTE_REQUIRED" });
      expect(apiClient.post).not.toHaveBeenCalled();
    },
  );

  it.each(["local", "intercity", "import"] as const)(
    "loads a backend USD quote for %s review",
    async (service) => {
      const input =
        service === "local"
          ? draft
          : {
              originCity: "A",
              destinationCity: "B",
              originBranchId: "1",
              destinationBranchId: "2",
            };
      vi.mocked(apiClient.post).mockResolvedValue({ data: quote() });
      const result = await estimateBookingQuote(service, input);
      expect(result).toMatchObject({
        currency: "USD",
        total: 12.5,
        formattedTotal: "USD 12.50",
      });
      expect(requireReviewedQuote(service, { ...input, quote: result })).toBe(
        result,
      );
    },
  );

  it("rejects non-USD backend quotes instead of relabelling their amount", async () => {
    vi.mocked(apiClient.post).mockResolvedValue({
      data: { ...quote(), currency: "ZMW" },
    });
    await expect(estimateBookingQuote("local", draft)).rejects.toMatchObject({
      code: "PRICING_NOT_CONFIGURED",
    });
  });

  it("invalidates the reviewed quote when the scheduled pickup changes", () => {
    const input = {
      ...draft,
      schedule: "scheduled",
      scheduledAt: "2030-01-01T12:00:00.000Z",
    };
    const reviewed = {
      ...quote(),
      requestKey: JSON.stringify(bookingQuoteRequestFromDraft("local", input)),
    };
    expect(() =>
      requireReviewedQuote("local", { ...input, quote: reviewed }),
    ).not.toThrow();
    expect(() =>
      requireReviewedQuote("local", {
        ...input,
        quote: reviewed,
        scheduledAt: "2030-01-02T12:00:00.000Z",
      }),
    ).toThrow();
  });
});
