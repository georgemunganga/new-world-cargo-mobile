import type { LocalCity } from "@/lib/maps/local-city";
import type { RouteSearchScope, RouteSuggestion } from "@/lib/route-autocomplete";

const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY?.trim() ?? "";
const autocompleteUrl = "https://places.googleapis.com/v1/places:autocomplete";

type GooglePrediction = {
  placeId?: string;
  text?: { text?: string };
  structuredFormat?: {
    mainText?: { text?: string };
    secondaryText?: { text?: string };
  };
  types?: string[];
};

type PlaceDetails = {
  id?: string;
  displayName?: { text?: string };
  formattedAddress?: string;
  location?: { latitude?: number; longitude?: number };
  addressComponents?: { longText?: string; shortText?: string; types?: string[] }[];
  types?: string[];
};

function placeKind(types: string[] = []): RouteSuggestion["kind"] {
  if (types.includes("airport")) return "airport";
  if (types.includes("port") || types.includes("marina")) return "port";
  if (types.includes("locality")) return "city";
  return "address";
}

function component(details: PlaceDetails, type: string, short = false) {
  const match = details.addressComponents?.find((item) => item.types?.includes(type));
  return short ? match?.shortText : match?.longText;
}

export function googlePlacesConfigured() {
  return apiKey !== "";
}

export async function autocompleteGooglePlaces(scope: RouteSearchScope, query: string, supportedCountryCodes: string[], localCity?: LocalCity): Promise<RouteSuggestion[]> {
  if (!googlePlacesConfigured() || query.trim().length < 3) return [];
  if (scope !== "local" && supportedCountryCodes.length === 0) return [];

  const body: Record<string, unknown> = {
    input: query.trim(),
    languageCode: "en",
    regionCode: scope === "local" ? "zm" : undefined,
    includedRegionCodes: (scope === "local" ? ["zm"] : supportedCountryCodes).slice(0, 15).map((code) => code.toLowerCase()),
  };
  if (scope === "local" && !localCity) return [];
  if (scope === "local" && localCity) {
    body.locationRestriction = {
      circle: { center: { latitude: localCity.latitude, longitude: localCity.longitude }, radius: 50000 },
    };
  }

  const response = await fetch(autocompleteUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "suggestions.placePrediction.placeId,suggestions.placePrediction.text.text,suggestions.placePrediction.structuredFormat,suggestions.placePrediction.types",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) throw new Error("Live location search is temporarily unavailable.");
  const payload = await response.json() as { suggestions?: { placePrediction?: GooglePrediction }[] };

  return (payload.suggestions ?? []).flatMap(({ placePrediction }) => {
    if (!placePrediction?.placeId) return [];
    const label = placePrediction.structuredFormat?.mainText?.text || placePrediction.text?.text || "Google Maps place";
    const detail = placePrediction.structuredFormat?.secondaryText?.text || placePrediction.text?.text || "Google Maps";
    return [{
      id: `google-${placePrediction.placeId}`,
      placeId: placePrediction.placeId,
      label,
      detail,
      city: label,
      area: label,
      kind: placeKind(placePrediction.types),
    } satisfies RouteSuggestion];
  });
}

export async function resolveGooglePlace(suggestion: RouteSuggestion): Promise<RouteSuggestion> {
  if (!suggestion.placeId || !googlePlacesConfigured()) return suggestion;
  const response = await fetch(`https://places.googleapis.com/v1/places/${encodeURIComponent(suggestion.placeId)}`, {
    headers: {
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "id,displayName,formattedAddress,location,addressComponents,types",
    },
  });
  if (!response.ok) throw new Error("We could not confirm that map location. Please try again.");
  const details = await response.json() as PlaceDetails;
  const city = component(details, "locality") || component(details, "administrative_area_level_2") || suggestion.city;
  const country = component(details, "country") || suggestion.country;
  const countryCode = component(details, "country", true)?.toUpperCase() || suggestion.countryCode;

  return {
    ...suggestion,
    label: details.displayName?.text || suggestion.label,
    detail: details.formattedAddress || suggestion.detail,
    city,
    cityDistrict: component(details, "administrative_area_level_2"),
    area: component(details, "sublocality") || component(details, "administrative_area_level_1") || city,
    country,
    countryCode,
    latitude: details.location?.latitude,
    longitude: details.location?.longitude,
    kind: placeKind(details.types),
  };
}
