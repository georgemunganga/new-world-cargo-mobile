import { describe, expect, it } from "vitest";
import { internationalRoutePoints, nearestReceivingBranch } from "../lib/maps/international-route";

describe("international route", () => {
  it("selects the nearest configured Zambia branch, excluding overseas and invalid offices", () => {
    const location = { latitude: -15.4, longitude: 28.3 };
    const branches = [
      { branchId: "foreign", country: "Zimbabwe", ...location },
      { branchId: "kitwe", countryCode: "ZM", latitude: -12.8, longitude: 28.2 },
      { branchId: "lusaka", country: "Zambia", latitude: -15.38, longitude: 28.32 },
      { branchId: "invalid", country: "Zambia", latitude: NaN, longitude: 28 },
    ];
    expect(nearestReceivingBranch(branches, location)?.branchId).toBe("lusaka");
    expect(nearestReceivingBranch([branches[0]], location)).toBeUndefined();
  });
  it("draws a finite route between the exact selected coordinates", () => {
    const origin = { latitude: 23.379, longitude: 113.763 };
    const destination = { latitude: -15.366, longitude: 29.232 };
    const points = internationalRoutePoints(origin, destination);
    expect(points[0].latitude).toBeCloseTo(origin.latitude);
    expect(points.at(-1)?.longitude).toBeCloseTo(destination.longitude);
    expect(points.every((p) => Number.isFinite(p.latitude) && Number.isFinite(p.longitude))).toBe(true);
  });
  it("takes the short path across the date line", () => {
    const points = internationalRoutePoints({ latitude: 10, longitude: 179 }, { latitude: 10, longitude: -179 });
    expect(points.every((point) => Math.abs(point.longitude) >= 179)).toBe(true);
  });
});
