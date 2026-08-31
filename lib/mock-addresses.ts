import type { Address } from "@/types/cargo";

export type AddressSearchResult = Address & {
  id: string;
  type: "address" | "branch" | "warehouse";
  landmark: string;
};

export const addressSearchResults: AddressSearchResult[] = [
  { id: "longacres-cairo", label: "Cairo Road business district", city: "Lusaka", area: "Longacres", detail: "Cairo Road, Longacres", type: "address", landmark: "Near the central business district" },
  { id: "roma-plot27", label: "Home", city: "Lusaka", area: "Roma", detail: "Plot 27, Great East Road", type: "address", landmark: "Great East Road corridor" },
  { id: "kabwata-branch", label: "New WorldCargo branch", city: "Lusaka", area: "Kabwata", detail: "New WorldCargo collection point", type: "branch", landmark: "Kabwata collection point" },
  { id: "woodlands", label: "Woodlands office", city: "Lusaka", area: "Woodlands", detail: "Mosi-o-Tunya Road", type: "address", landmark: "Near Woodlands Stadium" },
  { id: "nwc-warehouse", label: "New WorldCargo warehouse", city: "Lusaka", area: "Makeni", detail: "Makeni logistics area", type: "warehouse", landmark: "Warehouse receiving gate" },
];

export function searchMockAddresses(query: string) {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return addressSearchResults;
  return addressSearchResults.filter((item) => `${item.label} ${item.city} ${item.area} ${item.detail} ${item.landmark}`.toLowerCase().includes(normalized));
}

export function describeMockRoute(pickup?: Address, destination?: Address) {
  if (!pickup || !destination) return "Choose both pickup and delivery locations to see an accessible route description.";
  return `From ${pickup.detail} in ${pickup.area}, ${pickup.city}, to ${destination.detail} in ${destination.area}, ${destination.city}. The route preview follows the Great East Road corridor where available. Check the written address and landmark before requesting pickup.`;
}
