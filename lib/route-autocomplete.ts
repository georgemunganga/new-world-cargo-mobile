import { isInLocalCity, type LocalCity } from "@/lib/maps/local-city";
import type { Address } from "@/types/cargo";
import { apiClient } from "@/lib/api/client";
import { autocompleteGooglePlaces, resolveGooglePlace } from "@/lib/services/maps/google-places-service";

export type RouteSearchScope = "local" | "intercity" | "import" | "custom";
export type RouteSuggestion = {
  cityDistrict?: string;
  id: string;
  label: string;
  detail: string;
  branchId?: string;
  placeId?: string;
  city: string;
  area: string;
  country?: string;
  countryCode?: string;
  latitude?: number;
  longitude?: number;
  kind: "address" | "branch" | "warehouse" | "city" | "airport" | "port" | "supplier";
};
export type RouteGuard = {
  supported: boolean;
  reason?: string;
  supportedCountries: string[];
  supportedCities: string[];
  dynamicBranches: number;
};

let liveBranchSuggestions: RouteSuggestion[] = [];
let liveReferenceDataPromise: Promise<RouteSuggestion[]> | null = null;

type PortalReferenceData = {
  offices?: {
    id?: string | number;
    name?: string;
    address?: string | null;
    detail?: string | null;
    city?: string | null;
    country?: string | null;
    countryCode?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  }[];
};

const guardCopy: Record<RouteSearchScope, string> = {
  local: "Choose pickup and destination within your current city.",
  intercity: "City-to-City only supports configured cities and New WorldCargo branches.",
  import: "International Imports only supports selected supplier cities, ports, airports, and receiving branches returned by New WorldCargo.",
  custom: "Custom requests can only start from supported cities and branches. Contact Support for unsupported lanes.",
};

function knownPlaceFor(value: string): Pick<RouteSuggestion, "city" | "country" | "latitude" | "longitude"> | null {
  const text = value.toLowerCase();
  if (text.includes("guangzhou")) return { city: "Guangzhou", country: "China", latitude: 23.1291, longitude: 113.2644 };
  if (text.includes("shenzhen")) return { city: "Shenzhen", country: "China", latitude: 22.5431, longitude: 114.0579 };
  if (text.includes("dubai") || text.includes("emirates")) return { city: "Dubai", country: "United Arab Emirates", latitude: 25.2048, longitude: 55.2708 };
  if (text.includes("dar es salaam") || text.includes("tanzania") || text.includes("dar")) return { city: "Dar es Salaam", country: "Tanzania", latitude: -6.7924, longitude: 39.2083 };
  if (text.includes("zimbabwe") || text.includes("harare")) return { city: "Harare", country: "Zimbabwe", latitude: -17.8292, longitude: 31.0522 };
  if (text.includes("kitwe")) return { city: "Kitwe", country: "Zambia", latitude: -12.8024, longitude: 28.2132 };
  if (text.includes("ndola")) return { city: "Ndola", country: "Zambia", latitude: -12.9587, longitude: 28.6366 };
  if (text.includes("kabwe")) return { city: "Kabwe", country: "Zambia", latitude: -14.4469, longitude: 28.4464 };
  if (text.includes("livingstone")) return { city: "Livingstone", country: "Zambia", latitude: -17.8419, longitude: 25.8543 };
  if (text.includes("lusaka") || text.includes("kabwata") || text.includes("longacres") || text.includes("roma") || text.includes("woodlands")) return { city: "Lusaka", country: "Zambia", latitude: -15.3875, longitude: 28.3228 };
  if (text.includes("usa") || text.includes("united states")) return { city: inferUnknownCity(value), country: "United States" };
  return null;
}

function inferUnknownCity(value: string) {
  const firstSegment = value.split(/[,·-]/)[0]?.trim();
  return firstSegment || "Supported branch";
}

function mapOfficeToSuggestion(office: NonNullable<PortalReferenceData["offices"]>[number]): RouteSuggestion {
  const label = office.name || "New WorldCargo branch";
  const detail = office.detail || office.address || "New WorldCargo branch";
  const knownPlace = knownPlaceFor(`${label} ${detail}`);
  const city = office.city || knownPlace?.city || inferUnknownCity(`${label}, ${detail}`);
  return {
    id: `branch-${office.id ?? label}`,
    label,
    detail,
    branchId: office.id == null ? undefined : String(office.id),
    city,
    area: city,
    country: office.country || knownPlace?.country,
    countryCode: office.countryCode?.toUpperCase(),
    latitude: office.latitude ?? knownPlace?.latitude,
    longitude: office.longitude ?? knownPlace?.longitude,
    kind: "branch",
  };
}

function isBranchAllowedForScope(scope: RouteSearchScope, item: RouteSuggestion) {
  if (scope === "import" || scope === "custom") return true;
  if (scope === "local") return (item.countryCode === "ZM" || item.country === "Zambia");
  return item.countryCode === "ZM" || item.countryCode === "ZW" || item.country === "Zambia" || item.country === "Zimbabwe";
}

function branchPoolForScope(scope: RouteSearchScope) {
  return liveBranchSuggestions.filter((item) => isBranchAllowedForScope(scope, item));
}

function poolForScope(scope: RouteSearchScope) {

  return branchPoolForScope(scope).filter((item, index, list) => index === list.findIndex((candidate) => candidate.id === item.id || candidate.label.toLowerCase() === item.label.toLowerCase()));
}

function searchableText(item: RouteSuggestion) {
  return [item.label, item.detail, item.city, item.area, item.country].filter(Boolean).join(" ").toLowerCase();
}

function matchesSearch(item: RouteSuggestion, normalized: string) {
  const text = searchableText(item);
  if (normalized.length <= 3) {
    return text.split(/[^a-z0-9]+/).some((token) => token.startsWith(normalized));
  }
  return text.includes(normalized);
}

function countryForSuggestion(item: RouteSuggestion) {
  return item.country ?? knownPlaceFor(item.city)?.country;
}

function uniqueSorted(values: (string | undefined)[]) {
  return Array.from(new Set(values.filter((value): value is string => Boolean(value)))).sort((left, right) => left.localeCompare(right));
}

export function loadRouteReferenceData() {
  if (liveReferenceDataPromise) return liveReferenceDataPromise;
  liveReferenceDataPromise = apiClient.get<{ data: PortalReferenceData }>("/api/v1/reference-data", { auth: false })
    .then((response) => {
      liveBranchSuggestions = (response.data.offices ?? []).map(mapOfficeToSuggestion);
      return liveBranchSuggestions;
    })
    .catch(() => { liveReferenceDataPromise = null; return liveBranchSuggestions; });
  return liveReferenceDataPromise;
}

export function searchRouteSuggestions(scope: RouteSearchScope, query: string, localCity?: LocalCity) {
  const normalized = query.trim().toLowerCase();
  const pool = poolForScope(scope).filter((item) => scope !== "local" || isInLocalCity(item, localCity));
  if (!normalized) return pool.slice(0, 5);
  return pool.filter((item) => matchesSearch(item, normalized)).slice(0, 6);
}

export async function searchLiveRouteSuggestions(scope: RouteSearchScope, query: string, localCity?: LocalCity) {
  const configured = searchRouteSuggestions(scope, query, localCity);
  const countryCodes = uniqueSorted(branchPoolForScope(scope).map((item) => item.countryCode));
  const google = await autocompleteGooglePlaces(scope, query, countryCodes, localCity);
  return [...configured, ...google]
    .filter((item, index, list) => index === list.findIndex((candidate) => candidate.id === item.id || candidate.label.toLowerCase() === item.label.toLowerCase()))
    .slice(0, 6);
}

export function resolveRouteSuggestion(suggestion: RouteSuggestion) {
  return resolveGooglePlace(suggestion);
}

export function routeGuardForSearch(scope: RouteSearchScope, query: string): RouteGuard {
  const pool = poolForScope(scope);
  const normalized = query.trim();
  const matching = normalized ? pool.filter((item) => matchesSearch(item, normalized.toLowerCase())) : pool;
  const supported = !normalized || matching.length > 0;
  return {
    supported,
    reason: supported ? undefined : guardCopy[scope],
    supportedCountries: uniqueSorted(pool.map(countryForSuggestion)),
    supportedCities: uniqueSorted(pool.map((item) => item.city)),
    dynamicBranches: branchPoolForScope(scope).length,
  };
}

export function routeSuggestionToAddress(suggestion: RouteSuggestion): Address {
  return { label: suggestion.label, branchId: suggestion.branchId, city: suggestion.city, cityDistrict: suggestion.cityDistrict, area: suggestion.area, detail: suggestion.label, latitude: suggestion.latitude, longitude: suggestion.longitude };
}

