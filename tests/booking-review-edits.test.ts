import { describe, expect, it } from "vitest";

import { customRequestEditChoices, importMethodEditChoices, intercityFulfilmentEditChoices, localScheduleEditChoices, quickEditDrawerSnap } from "../lib/booking-review-edits";

describe("booking review quick edits", () => {
  it("keeps short review edits as known service-specific selections", () => {
    expect(localScheduleEditChoices.map((choice) => choice.id)).toEqual(["as_soon_as_possible", "later_today", "scheduled"]);
    expect(intercityFulfilmentEditChoices.map((choice) => choice.id)).toEqual(["collection", "door_delivery"]);
    expect(importMethodEditChoices.map((choice) => choice.id)).toEqual(["air", "sea"]);
    expect(customRequestEditChoices.map((choice) => choice.id)).toEqual(["cargo", "business", "other"]);
  });

  it("uses an expanded drawer only when a short edit has several choices", () => {
    expect(quickEditDrawerSnap(2)).toBe("half");
    expect(quickEditDrawerSnap(3)).toBe("expanded");
  });
});
