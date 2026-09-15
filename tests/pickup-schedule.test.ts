import { expect, it } from "vitest";
import { isPickupTimeValid } from "../lib/pickup-schedule";
it("accepts the current minute and future dates, rejecting earlier times", () => {
  const now = Date.parse("2026-09-15T08:30:25+02:00");
  expect(isPickupTimeValid("2026-09-15T08:30:00+02:00", now)).toBe(true);
  expect(isPickupTimeValid("2026-09-16T08:30:00+02:00", now)).toBe(true);
  expect(isPickupTimeValid("2026-09-15T08:29:59+02:00", now)).toBe(false);
  expect(isPickupTimeValid("invalid", now)).toBe(false);
  expect(isPickupTimeValid(undefined, now)).toBe(false);
});
