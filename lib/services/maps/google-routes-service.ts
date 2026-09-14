const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";

export type MapCoordinate = { latitude: number; longitude: number };

export async function computeGoogleRoadRoute(origin: MapCoordinate, destination: MapCoordinate): Promise<MapCoordinate[]> {
  if (!apiKey) return [origin, destination];
  const response = await fetch("https://routes.googleapis.com/directions/v2:computeRoutes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "routes.distanceMeters,routes.duration,routes.polyline.geoJsonLinestring",
    },
    body: JSON.stringify({
      origin: { location: { latLng: origin } },
      destination: { location: { latLng: destination } },
      travelMode: "DRIVE",
      routingPreference: "TRAFFIC_AWARE",
      polylineQuality: "OVERVIEW",
      polylineEncoding: "GEO_JSON_LINESTRING",
      languageCode: "en-US",
      units: "METRIC",
    }),
  });
  if (!response.ok) throw new Error("Road route unavailable");
  const payload = await response.json() as {
    routes?: Array<{ polyline?: { geoJsonLinestring?: { coordinates?: number[][] } } }>;
  };
  const coordinates = payload.routes?.[0]?.polyline?.geoJsonLinestring?.coordinates ?? [];
  const route = coordinates.flatMap((coordinate) => {
    const [longitude, latitude] = coordinate;
    return Number.isFinite(latitude) && Number.isFinite(longitude) ? [{ latitude, longitude }] : [];
  });
  return route.length > 1 ? route : [origin, destination];
}
