import { describe, expect, it } from "vitest";
import { mockBookingRepository } from "../lib/adapters/mock/mock-booking-adapter";

describe("mobile booking repository", () => {
  it("submits a local booking through the repository boundary", async () => {
    const result = await mockBookingRepository.submitBooking({ service: "local", draft: { pickup: "Lusaka", destination: "Roma" } });

    expect(result).toMatchObject({
      service: "local",
      status: "received",
      message: "Delivery request received.",
    });
    expect(result.reference).toMatch(/^NWC-/);
  });

  it("submits quote-based booking services without requiring backend-specific fields", async () => {
    const result = await mockBookingRepository.submitBooking({ service: "import", draft: { method: "sea" } });

    expect(result.status).toBe("quote_pending");
  });
});
