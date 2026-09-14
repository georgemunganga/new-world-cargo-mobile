import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.restoreAllMocks();
  vi.resetModules();
  delete process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
});

describe("Google map services", () => {
  it("restricts local autocomplete to the Lusaka service area and resolves coordinates", async () => {
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY = "test-key";
    const fetchMock = vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ suggestions: [{ placePrediction: { placeId: "place-1", structuredFormat: { mainText: { text: "Manda Hill" }, secondaryText: { text: "Great East Road, Lusaka" } }, types: ["shopping_mall"] } }] }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: "place-1", displayName: { text: "Manda Hill" }, formattedAddress: "Great East Road, Lusaka, Zambia", location: { latitude: -15.3901, longitude: 28.3221 }, addressComponents: [{ longText: "Lusaka", shortText: "Lusaka", types: ["locality"] }, { longText: "Zambia", shortText: "ZM", types: ["country"] }] }), { status: 200 }));
    vi.stubGlobal("fetch", fetchMock);
    const service = await import("../lib/services/maps/google-places-service");

    const suggestions = await service.autocompleteGooglePlaces("local", "Manda", []);
    expect(JSON.parse(fetchMock.mock.calls[0]![1]!.body as string)).toMatchObject({ includedRegionCodes: ["zm"], locationRestriction: { circle: { radius: 50000 } } });
    const resolved = await service.resolveGooglePlace(suggestions[0]!);
    expect(resolved).toMatchObject({ placeId: "place-1", city: "Lusaka", countryCode: "ZM", latitude: -15.3901, longitude: 28.3221 });
  });

  it("uses Google road geometry instead of a two-point placeholder", async () => {
    process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY = "test-key";
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ routes: [{ polyline: { geoJsonLinestring: { coordinates: [[28.3, -15.4], [28.31, -15.39], [28.32, -15.38]] } } }] }), { status: 200 })));
    const { computeGoogleRoadRoute } = await import("../lib/services/maps/google-routes-service");

    await expect(computeGoogleRoadRoute({ latitude: -15.4, longitude: 28.3 }, { latitude: -15.38, longitude: 28.32 })).resolves.toEqual([
      { latitude: -15.4, longitude: 28.3 },
      { latitude: -15.39, longitude: 28.31 },
      { latitude: -15.38, longitude: 28.32 },
    ]);
  });
});
