import { describe, expect, it } from "vitest";
import { isContactsReady, isLocalDeliveryReadyToReview, isRouteReady, nextBookingStep } from "../lib/booking-progress";
import type { LocalDeliveryDraft } from "../types/cargo";

const baseDraft: LocalDeliveryDraft = {
  service: "local",
  step: "route",
  pickup: { city: "Lusaka", area: "Longacres", detail: "Cairo Road" },
  destination: { city: "Lusaka", area: "Roma", detail: "Great East Road" },
  parcelCategory: "box",
  sender: { name: "Chanda", phone: "+260 971 000 000" },
  receiver: { name: "Amina", phone: "+260 977 000 000" },
  schedule: "as_soon_as_possible",
};

describe("Local Delivery booking flow", () => {
  it("uses a predictable booking-step order", () => {
    expect(nextBookingStep("route")).toBe("parcel");
    expect(nextBookingStep("review")).toBeNull();
  });

  it("requires both complete route endpoints", () => {
    expect(isRouteReady(baseDraft)).toBe(true);
    expect(isRouteReady({ ...baseDraft, destination: { city: "Lusaka", area: "", detail: "Great East Road" } })).toBe(false);
  });

  it("requires sender and receiver contacts before review", () => {
    expect(isContactsReady(baseDraft)).toBe(true);
    expect(isContactsReady({ ...baseDraft, receiver: { name: "Amina", phone: "" } })).toBe(false);
  });

  it("allows review only when the Local Delivery draft is complete", () => {
    expect(isLocalDeliveryReadyToReview(baseDraft)).toBe(true);
    expect(isLocalDeliveryReadyToReview({ ...baseDraft, parcelCategory: undefined })).toBe(false);
  });
});
