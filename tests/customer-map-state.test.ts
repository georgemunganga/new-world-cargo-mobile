import { describe, expect, it } from "vitest";
import { clampMockMapZoom, initialMapZoom, isInternationalMapMode } from "../lib/customer-map-state";

describe("customer map state", () => {
  it("uses a deliberately zoomed-out starting view for international tracking", () => {
    expect(initialMapZoom.international).toBeLessThan(initialMapZoom["live-local"]);
    expect(isInternationalMapMode("international")).toBe(true);
    expect(isInternationalMapMode("route-preview")).toBe(false);
  });

  it("keeps deterministic mock zoom within the supported customer control range", () => {
    expect(clampMockMapZoom(0.2)).toBe(0.7);
    expect(clampMockMapZoom(2.2)).toBe(1.55);
    expect(clampMockMapZoom(1.234)).toBe(1.23);
  });
});
