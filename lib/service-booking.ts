import type {
  Address,
  ImportBookingDraft,
  IntercityBookingDraft,
} from "@/types/cargo";

export const importSteps = [
  { id: "route", label: "Route & method" },
  { id: "cargo", label: "Cargo" },
  { id: "consignee", label: "Receiver" },
  { id: "review", label: "Review" },
];

export function isImportReady(draft: ImportBookingDraft) {
  return Boolean(
    draft.method &&
    draft.originCountry &&
    draft.originCity &&
    draft.originBranchId &&
    draft.destinationCity &&
    draft.destinationBranchId &&
    draft.cargoCategory &&
    draft.consignee?.name &&
    draft.consignee.phone,
  );
}

export const intercitySteps = [
  { id: "route", label: "Route" },
  { id: "cargo", label: "Cargo" },
  { id: "contacts", label: "Contacts" },
  { id: "fulfilment", label: "Collection" },
  { id: "review", label: "Review" },
];

export function isIntercityReady(draft: IntercityBookingDraft) {
  // Collection-point shipments move branch-to-branch, so both branch IDs are
  // required. Door delivery works from a plain address (a Google Places result
  // carries no branchId), so only the cities are required in that case.
  const branchesReady = draft.fulfilment === "door_delivery"
    ? true
    : Boolean(draft.originBranchId && draft.destinationBranchId);
  return Boolean(
    draft.originCity &&
    draft.destinationCity &&
    branchesReady &&
    draft.cargoCategory &&
    draft.sender?.name &&
    draft.sender.phone &&
    draft.receiver?.name &&
    draft.receiver.phone &&
    draft.fulfilment,
  );
}

export function isRouteComplete(pickup?: Address, destination?: Address) {
  return Boolean(
    pickup?.city &&
    pickup.area &&
    pickup.detail &&
    destination?.city &&
    destination.area &&
    destination.detail,
  );
}
