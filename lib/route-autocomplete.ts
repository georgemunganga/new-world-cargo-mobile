import type { Address } from "@/types/cargo";

export type RouteSearchScope = "local" | "intercity" | "import" | "custom";
export type RouteSuggestion = {
  id: string;
  label: string;
  detail: string;
  city: string;
  area: string;
  country?: string;
  kind: "address" | "branch" | "warehouse" | "city" | "airport" | "port" | "supplier";
};

const suggestions: Record<RouteSearchScope, RouteSuggestion[]> = {
  local: [
    { id: "local-longacres", label: "Longacres, Lusaka", detail: "Cairo Road business district", city: "Lusaka", area: "Longacres", kind: "address" },
    { id: "local-roma", label: "Roma, Lusaka", detail: "Great East Road and surrounding area", city: "Lusaka", area: "Roma", kind: "address" },
    { id: "local-kabwata", label: "New WorldCargo Kabwata", detail: "Collection point · Kabwata", city: "Lusaka", area: "Kabwata", kind: "branch" },
    { id: "local-woodlands", label: "Woodlands, Lusaka", detail: "Mosi-o-Tunya Road area", city: "Lusaka", area: "Woodlands", kind: "address" },
    { id: "local-eastpark", label: "East Park Mall", detail: "Great East Road landmark", city: "Lusaka", area: "Olympia", kind: "address" },
  ],
  intercity: [
    { id: "city-lusaka", label: "Lusaka", detail: "New WorldCargo main hub", city: "Lusaka", area: "Central", kind: "city" },
    { id: "city-ndola", label: "Ndola", detail: "Copperbelt receiving hub", city: "Ndola", area: "Town Centre", kind: "city" },
    { id: "city-kitwe", label: "Kitwe", detail: "Copperbelt city route", city: "Kitwe", area: "Parklands", kind: "city" },
    { id: "city-kabwe", label: "Kabwe", detail: "Central province route", city: "Kabwe", area: "Central", kind: "city" },
    { id: "city-livingstone", label: "Livingstone", detail: "Southern province route", city: "Livingstone", area: "Central", kind: "city" },
  ],
  import: [
    { id: "import-guangzhou", label: "Guangzhou, China", detail: "Supplier city · South China", city: "Guangzhou", area: "Baiyun", country: "China", kind: "supplier" },
    { id: "import-shenzhen", label: "Shenzhen, China", detail: "Supplier city · Guangdong", city: "Shenzhen", area: "Nanshan", country: "China", kind: "supplier" },
    { id: "import-dubai", label: "Dubai, United Arab Emirates", detail: "Supplier and consolidation city", city: "Dubai", area: "Deira", country: "United Arab Emirates", kind: "supplier" },
    { id: "import-dar-airport", label: "Julius Nyerere Airport", detail: "Dar es Salaam, Tanzania · Air route", city: "Dar es Salaam", area: "Kipawa", country: "Tanzania", kind: "airport" },
    { id: "import-dar-port", label: "Port of Dar es Salaam", detail: "Dar es Salaam, Tanzania · Sea route", city: "Dar es Salaam", area: "Kivukoni", country: "Tanzania", kind: "port" },
    { id: "import-lusaka", label: "Lusaka, Zambia", detail: "New WorldCargo receiving city", city: "Lusaka", area: "Kabwata", country: "Zambia", kind: "city" },
  ],
  custom: [
    { id: "custom-lusaka", label: "Lusaka", detail: "Any Lusaka collection or delivery area", city: "Lusaka", area: "Central", kind: "city" },
    { id: "custom-ndola", label: "Ndola", detail: "Copperbelt service location", city: "Ndola", area: "Town Centre", kind: "city" },
    { id: "custom-kitwe", label: "Kitwe", detail: "Copperbelt service location", city: "Kitwe", area: "Parklands", kind: "city" },
    { id: "custom-kabwata", label: "New WorldCargo Kabwata", detail: "Collection branch", city: "Lusaka", area: "Kabwata", kind: "branch" },
  ],
};

export function searchRouteSuggestions(scope: RouteSearchScope, query: string) {
  const normalized = query.trim().toLowerCase();
  const pool = suggestions[scope];
  if (!normalized) return pool.slice(0, 5);
  return pool.filter((item) => [item.label, item.detail, item.city, item.area, item.country].filter(Boolean).join(" ").toLowerCase().includes(normalized)).slice(0, 6);
}

export function routeSuggestionToAddress(suggestion: RouteSuggestion): Address {
  return { label: suggestion.label, city: suggestion.city, area: suggestion.area, detail: suggestion.label };
}
