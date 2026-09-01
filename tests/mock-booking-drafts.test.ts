import { describe, expect, it } from "vitest";
import { draftServiceColor, mockBookingDraftRecords } from "../lib/mock-booking-drafts";

describe("mock booking draft records", () => {
  it("includes resume records for all customer booking journeys", () => {
    expect(mockBookingDraftRecords.map((draft) => draft.service)).toEqual(["local", "import", "intercity", "custom"]);
    expect(mockBookingDraftRecords.every((draft) => draft.resumeHref.startsWith("/"))).toBe(true);
  });

  it("preserves deliberate custom-request emphasis", () => {
    expect(draftServiceColor("custom")).toBe("navy");
  });
});
