import type { Address } from "@/types/cargo";

export type LocalDeliveryQuote = { price: string; eta: string; distance: string; arrivalWindow: string };

export function getLocalDeliveryQuote(pickup?: Address, destination?: Address): LocalDeliveryQuote | null {
  if (!pickup || !destination || !pickup.detail.trim() || !destination.detail.trim()) return null;
  const pair = `${pickup.area.toLowerCase()}-${destination.area.toLowerCase()}`;
  if (pair === "roma-longacres" || pair === "longacres-roma") return { price: "K 68", eta: "Pickup in 7 min", distance: "4.2 km", arrivalWindow: "Delivery around 14:15" };
  if (pair.includes("kabwata")) return { price: "K 74", eta: "Pickup in 9 min", distance: "5.1 km", arrivalWindow: "Delivery around 14:20" };
  return { price: "K 82", eta: "Pickup in 10 min", distance: "6.4 km", arrivalWindow: "Delivery around 14:25" };
}
