import { describe, expect, it } from "vitest";
import { deviceReviewChecks, nextDeviceReviewStatus } from "../lib/device-review";

describe("device review checklist", () => {
  it("keeps required physical-device review areas represented", () => {
    expect(deviceReviewChecks.map((check) => check.id)).toEqual(expect.arrayContaining(["small-layout", "text-scale", "screen-reader", "keyboard", "map-gestures", "system-bars"]));
  });

  it("cycles each check through not tested, pass, issue, and reset", () => {
    expect(nextDeviceReviewStatus("not-tested")).toBe("pass");
    expect(nextDeviceReviewStatus("pass")).toBe("issue");
    expect(nextDeviceReviewStatus("issue")).toBe("not-tested");
  });
});
