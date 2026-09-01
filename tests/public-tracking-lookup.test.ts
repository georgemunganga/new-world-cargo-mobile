import { describe, expect, it } from "vitest";

import { shipments } from "../lib/mock-cargo-data";
import { resolvePublicTrackingLookup } from "../lib/public-tracking-lookup";

describe("resolvePublicTrackingLookup", () => {
  it("returns a matching mock shipment", () => {
    expect(resolvePublicTrackingLookup("NWC-784512", shipments)).toMatchObject({ kind: "found", shipment: { id: "nwc-24518" } });
  });

  it("provides separate not-found and retryable-unavailable states", () => {
    expect(resolvePublicTrackingLookup("unknown", shipments).kind).toBe("not-found");
    expect(resolvePublicTrackingLookup("NWC-OFFLINE", shipments).kind).toBe("unavailable");
  });
});
