import { beforeEach, describe, expect, it, vi } from "vitest";
const { get } = vi.hoisted(() => ({ get: vi.fn() }));
vi.mock("../lib/api/client", () => ({ apiClient: { get } }));
const offices = [
  { id: 1, name: "Lusaka office", city: "Lusaka", country: "Zambia", countryCode: "ZM", latitude: -15.4, longitude: 28.3 },
  { id: 2, name: "Kitwe office", city: "Kitwe", country: "Zambia", countryCode: "ZM", latitude: -12.8, longitude: 28.2 },
  { id: 3, name: "China office", city: "Guangzhou", country: "China", countryCode: "CN", latitude: 23.3, longitude: 113.7 },
];
beforeEach(() => { vi.resetModules(); get.mockReset(); get.mockResolvedValue({ data: { offices } }); });
describe("configured route suggestions", () => {
  it("does not invent sample locations before reference data loads", async () => {
    const routes = await import("../lib/route-autocomplete");
    expect(routes.searchRouteSuggestions("local", "roma")).toEqual([]);
  });
  it("restricts local offices to the configured local service city", async () => {
    const routes = await import("../lib/route-autocomplete");
    await routes.loadRouteReferenceData();
    expect(routes.searchRouteSuggestions("local", "", { city: "Lusaka", latitude: -15.4, longitude: 28.3 }).map((p) => p.branchId)).toEqual(["1"]);
    expect(routes.searchRouteSuggestions("local", "", { city: "Kitwe", latitude: -12.8, longitude: 28.2 }).map((p) => p.branchId)).toEqual(["2"]);
    expect(routes.searchRouteSuggestions("local", "")).toEqual([]);
  });
  it("offers configured domestic branches for intercity routes", async () => {
    const routes = await import("../lib/route-autocomplete");
    await routes.loadRouteReferenceData();
    expect(routes.searchRouteSuggestions("intercity", "kitwe")[0].branchId).toBe("2");
    expect(routes.searchRouteSuggestions("intercity", "china")).toEqual([]);
  });
  it("preserves exact backend branch coordinates when selected", async () => {
    const routes = await import("../lib/route-autocomplete");
    await routes.loadRouteReferenceData();
    expect(routes.routeSuggestionToAddress(routes.searchRouteSuggestions("import", "china")[0])).toMatchObject({ branchId: "3", latitude: 23.3, longitude: 113.7 });
  });
  it("does not substitute sample branches after network failure", async () => {
    get.mockRejectedValue(new Error("offline"));
    const routes = await import("../lib/route-autocomplete");
    await routes.loadRouteReferenceData();
    expect(routes.searchRouteSuggestions("import", "")).toEqual([]);
  });
  it("reports supported countries from configured offices", async () => {
    const routes = await import("../lib/route-autocomplete");
    await routes.loadRouteReferenceData();
    expect(routes.routeGuardForSearch("import", "").supportedCountries).toEqual(["China", "Zambia"]);
    expect(routes.routeGuardForSearch("import", "Canada").supported).toBe(false);
  });
});
