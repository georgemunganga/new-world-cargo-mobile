import type { Address } from "@/types/cargo";
import type { MockDirectoryItem } from "@/lib/mock-account-directory";

export function savedPlaceToAddress(place: MockDirectoryItem): Address {
  const [area = place.detail, city = "Lusaka"] = place.detail.split(",").map((part) => part.trim());
  return { label: place.label, detail: `${place.label} · ${place.detail}`, area, city };
}

export function recipientToBookingContact(recipient: MockDirectoryItem) {
  const segments = recipient.detail.split("·").map((part) => part.trim());
  return { name: recipient.label, phone: segments[segments.length - 1] ?? "" };
}
