import type { Address } from "@/types/cargo";
import type { AddressBookItem } from "@/lib/domain/address-book";

export function savedPlaceToAddress(place: AddressBookItem): Address {
  const [inferredArea = place.detail, inferredCity = "Lusaka"] = place.detail.split(",").map((part) => part.trim());
  return {
    label: place.label,
    detail: `${place.label} · ${place.detail}`,
    area: place.area || inferredArea,
    city: place.city || inferredCity,
    ...(typeof place.latitude === "number" ? { latitude: place.latitude } : {}),
    ...(typeof place.longitude === "number" ? { longitude: place.longitude } : {}),
  };
}

export function recipientToBookingContact(recipient: AddressBookItem) {
  const segments = recipient.detail.split("·").map((part) => part.trim());
  return { name: recipient.label, phone: segments[segments.length - 1] ?? "" };
}
