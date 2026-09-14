import { describe, expect, it } from "vitest";

import { getLiveTrackingHistory } from "../lib/live-tracking-history";
import { shipments } from "../lib/mock-cargo-data";

describe("getLiveTrackingHistory", () => {
  it("uses authoritative server events when the shipment supplies them", () => {
    const history = getLiveTrackingHistory({
      ...shipments[0],
      trackingEvents: [{ id: "server-1", label: "Received at depot", detail: "Recorded by operations", displayTime: "Sep 14, 2026 8:00 AM", state: "current" }],
    });
    expect(history).toEqual([{ id: "server-1", label: "Received at depot", detail: "Recorded by operations", time: "Sep 14, 2026 8:00 AM", state: "current" }]);
  });

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
