import { describe, expect, it } from "vitest";
import { routeSuggestionToAddress, searchRouteSuggestions } from "../lib/route-autocomplete";

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
    expect(routeSuggestionToAddress(suggestion)).toEqual({ label: "Guangzhou, China", city: "Guangzhou", area: "Baiyun", detail: "Guangzhou, China" });
  });
});
