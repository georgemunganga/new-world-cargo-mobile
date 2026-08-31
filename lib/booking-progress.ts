import type { BookingStep, LocalDeliveryDraft } from "@/types/cargo";

export const bookingSteps: BookingStep[] = ["route", "parcel", "contacts", "schedule", "review"];

export function nextBookingStep(step: BookingStep): BookingStep | null {
  const index = bookingSteps.indexOf(step);
  return bookingSteps[index + 1] ?? null;
}

export function isRouteReady(draft: LocalDeliveryDraft) {
  return Boolean(draft.pickup?.detail && draft.pickup.area && draft.destination?.detail && draft.destination.area);
}

export function isContactsReady(draft: LocalDeliveryDraft) {
  return Boolean(draft.sender?.name && draft.sender.phone && draft.receiver?.name && draft.receiver.phone);
}

export function isLocalDeliveryReadyToReview(draft: LocalDeliveryDraft) {
  return isRouteReady(draft) && Boolean(draft.parcelCategory) && isContactsReady(draft) && Boolean(draft.schedule);
}
