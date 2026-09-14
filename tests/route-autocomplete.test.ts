import { describe, expect, it } from "vitest";
import { routeGuardForSearch, routeSuggestionToAddress, searchRouteSuggestions } from "../lib/route-autocomplete";

describe("service-aware inline route autocomplete", () => {
  it("keeps Local Delivery suggestions scoped to nearby local places", () => {
    const matches = searchRouteSuggestions("local", "roma");
    expect(matches).toHaveLength(1);
    expect(matches[0]?.city).toBe("Lusaka");
  });

  it("returns city and branch suggestions for City-to-City routes", () => {
    const matches = searchRouteSuggestions("intercity", "kitwe");
    expect(matches[0]?.kind).toBe("city");
    expect(matches[0]?.label).toBe("Kitwe");
  });

  it("returns supplier cities, ports, or airports only within International Imports scope", () => {
    const matches = searchRouteSuggestions("import", "dar");
    expect(matches.map((item) => item.kind)).toEqual(expect.arrayContaining(["airport", "port"]));
    expect(searchRouteSuggestions("local", "dar")).toHaveLength(0);
  });

  it("converts a selected suggestion into the structured route model", () => {
    const suggestion = searchRouteSuggestions("import", "guangzhou")[0]!;
    expect(routeSuggestionToAddress(suggestion)).toEqual({ label: "Guangzhou, China", branchId: undefined, city: "Guangzhou", area: "Baiyun", detail: "Guangzhou, China", latitude: 23.1291, longitude: 113.2644 });
  });

  it("keeps International Import lane pins on selected cities instead of user location", () => {
    const origin = searchRouteSuggestions("import", "guangzhou")[0]!;
    const destination = searchRouteSuggestions("import", "lusaka")[0]!;
    expect(origin).toMatchObject({ city: "Guangzhou", country: "China", latitude: 23.1291, longitude: 113.2644 });
    expect(destination).toMatchObject({ city: "Lusaka", country: "Zambia", latitude: -15.3875, longitude: 28.3228 });
  });

  it("blocks unsupported countries unless they are returned as supported backend branches", () => {
    expect(searchRouteSuggestions("import", "usa")).toHaveLength(0);
    expect(routeGuardForSearch("import", "usa")).toMatchObject({
      supported: false,
      reason: expect.stringContaining("International Imports only supports selected"),
    });
    expect(routeGuardForSearch("import", "guangzhou").supported).toBe(true);
  });

  it("reports the supported network for map/search guardrails", () => {
    const guard = routeGuardForSearch("intercity", "");
    expect(guard).toMatchObject({ supported: true, dynamicBranches: 0 });
    expect(guard.supportedCountries).toContain("Zambia");
    expect(guard.supportedCities).toEqual(expect.arrayContaining(["Lusaka", "Kitwe"]));
  });
});
