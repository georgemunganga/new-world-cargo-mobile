import type { Address } from "@/types/cargo";
import type { AddressBookItem } from "@/lib/domain/address-book";

export function savedPlaceToAddress(place: AddressBookItem): Address {
  const [area = place.detail, city = "Lusaka"] = place.detail.split(",").map((part) => part.trim());
  return { label: place.label, detail: `${place.label} · ${place.detail}`, area, city };
}

export function recipientToBookingContact(recipient: AddressBookItem) {
  const segments = recipient.detail.split("·").map((part) => part.trim());
  return { name: recipient.label, phone: segments[segments.length - 1] ?? "" };
}
