import { expect, it } from "vitest";
import { readablePlaceLabel } from "../lib/maps/place-label";
it("uses a street name instead of a plus code", () => {
  expect(readablePlaceLabel({ name: "M75F+C3J", street: "Great North Road", city: "Lusaka" })).toBe("Great North Road");
});
it("uses a readable fallback without inventing a nearby place", () => {
  expect(readablePlaceLabel({ name: "M75F+C3J", city: "Lusaka" }, "Current location")).toBe("Current location, Lusaka");
  expect(readablePlaceLabel({ street: "M75F+C3J", city: "Lusaka" })).toBe("Selected location, Lusaka");
});
