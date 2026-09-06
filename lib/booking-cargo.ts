import type { BookingCargoAttachment, BookingCargoItem } from "@/types/cargo";

export type CargoService = "local" | "import" | "intercity" | "custom";

export function blankCargoItem(id = "cargo-1"): BookingCargoItem {
  return { id, name: "", quantity: 1 };
}

export function hasCompleteCargoItems(items: BookingCargoItem[] | undefined): boolean {
  return Boolean(items?.length && items.every((item) => item.name.trim().length > 0 && item.quantity > 0));
}

export function cargoItemsSummary(items: BookingCargoItem[] | undefined, fallback = "Not added"): string {
  if (!items?.length) return fallback;
  const complete = items.filter((item) => item.name.trim());
  if (!complete.length) return fallback;
  return complete.map((item) => `${item.name.trim()} × ${item.quantity}`).join(", ");
}

export function supportingDocumentCopy(service: CargoService): { label: string; description: string; empty: string } {
  if (service === "import") return { label: "Upload debit or delivery note", description: "Attach the supplier’s supporting document.", empty: "No delivery note chosen" };
  return { label: "Upload receipt, invoice, or proof", description: "Attach a receipt, invoice, or other supporting document if it helps us handle the cargo.", empty: "No supporting document chosen" };
}

export function nextMockAttachment(kind: BookingCargoAttachment["kind"], index: number): BookingCargoAttachment {
  const title = kind === "photo" ? `Cargo photo ${index}` : "Supporting document";
  return { id: `${kind}-${index}`, name: title, kind };
}
