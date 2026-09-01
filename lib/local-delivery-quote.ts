import type { Address, LocalDeliveryVehicle } from "@/types/cargo";

export type LocalDeliveryQuote = { price: string; eta: string; distance: string; arrivalWindow: string; vehicleLabel: string; capacity: string };

const vehicleAdjustments: Record<LocalDeliveryVehicle, { fare: number; eta: string; label: string; capacity: string }> = {
  scooter: { fare: 0, eta: "Pickup in 7 min", label: "Cargo bike", capacity: "Up to 8 kg" },
  small_van: { fare: 28, eta: "Pickup in 10 min", label: "Small van", capacity: "Up to 50 kg" },
  cargo_van: { fare: 62, eta: "Pickup in 14 min", label: "Cargo van", capacity: "Up to 300 kg" },
};

export function getLocalDeliveryQuote(pickup?: Address, destination?: Address, vehicle: LocalDeliveryVehicle = "scooter"): LocalDeliveryQuote | null {
  if (!pickup || !destination || !pickup.detail.trim() || !destination.detail.trim()) return null;
  const pair = `${pickup.area.toLowerCase()}-${destination.area.toLowerCase()}`;
  const base = pair === "roma-longacres" || pair === "longacres-roma" ? { price: 68, distance: "4.2 km", arrivalWindow: "Delivery around 14:15" } : pair.includes("kabwata") ? { price: 74, distance: "5.1 km", arrivalWindow: "Delivery around 14:20" } : { price: 82, distance: "6.4 km", arrivalWindow: "Delivery around 14:25" };
  const adjustment = vehicleAdjustments[vehicle];
  return { price: `K ${base.price + adjustment.fare}`, eta: adjustment.eta, distance: base.distance, arrivalWindow: base.arrivalWindow, vehicleLabel: adjustment.label, capacity: adjustment.capacity };
}
