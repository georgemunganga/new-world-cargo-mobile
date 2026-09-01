import { describe, expect, it } from "vitest";
import { shipments } from "../lib/mock-cargo-data";
import { findShipmentForTrackingCode, normaliseTrackingCode } from "../lib/mock-tracking-scan";

describe("mock tracking scan", () => {
  it("normalises typed tracking code formatting", () => {
    expect(normaliseTrackingCode(" nw-784512 ")).toBe("NW-784512");
  });

  it("finds an existing shipment with a typed code", () => {
    expect(findShipmentForTrackingCode(shipments[0].reference.toLowerCase(), shipments)?.id).toBe(shipments[0].id);
  });
});
