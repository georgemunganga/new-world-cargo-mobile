import { describe, expect, it } from "vitest";

import { getLiveTrackingHistory } from "../lib/live-tracking-history";
import { shipments } from "../lib/mock-cargo-data";

describe("getLiveTrackingHistory", () => {
  it("creates a chronological current-progress timeline with route context", () => {
    const history = getLiveTrackingHistory(shipments[0]);
    expect(history).toHaveLength(4);
    expect(history.some((event) => event.state === "current")).toBe(true);
    expect(history[0].detail).toContain(shipments[0].pickup.city);
    expect(history[3].detail).toContain(shipments[0].destination.city);
  });

  it("keeps pending shipments at the first confirmation stage", () => {
    const pending = getLiveTrackingHistory(shipments[2]);
    expect(pending[0].state).toBe("current");
    expect(pending.slice(1).every((event) => event.state === "upcoming")).toBe(true);
  });
});
