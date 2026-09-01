import type { ImportBookingDraft, IntercityBookingDraft } from "@/types/cargo";

export const importSteps = [{ id: "method", label: "Method" }, { id: "route", label: "Route" }, { id: "cargo", label: "Cargo" }, { id: "consignee", label: "Consignee" }, { id: "review", label: "Review" }];

export function isImportReady(draft: ImportBookingDraft) {
  return Boolean(draft.method && draft.originCountry && draft.originCity && draft.destinationCity && draft.cargoCategory && draft.consignee?.name && draft.consignee.phone);
}

export const intercitySteps = [{ id: "route", label: "Route" }, { id: "cargo", label: "Cargo" }, { id: "contacts", label: "Contacts" }, { id: "fulfilment", label: "Collection" }, { id: "review", label: "Review" }];

export function isIntercityReady(draft: IntercityBookingDraft) {
  return Boolean(draft.originCity && draft.destinationCity && draft.cargoCategory && draft.sender?.name && draft.sender.phone && draft.receiver?.name && draft.receiver.phone && draft.fulfilment);
}
