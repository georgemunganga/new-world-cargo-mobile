import { mockBookingDraftRecords } from "@/lib/mock-booking-drafts";
import type { BookingSubmissionResult } from "@/lib/domain/booking";
import type { BookingRepository } from "@/lib/repositories/types";
import { recordMockSubmittedBooking } from "@/lib/adapters/mock/mock-shipment-adapter";
import type { BookingDraftSummary } from "@/lib/domain/booking";

/** Drafts saved during this session, newest first. */
const mockSavedDrafts: BookingDraftSummary[] = [];

export const mockBookingRepository: BookingRepository = {
  async listDrafts() {
    return [...mockSavedDrafts, ...mockBookingDraftRecords.map((draft) => ({
      id: draft.id,
      service: draft.service,
      title: draft.title,
      progressLabel: `${draft.stepLabel} · ${draft.progress}`,
      updatedAt: draft.updatedAt,
      payload: draft.payload,
    }))];
  },
  async saveDraft(input) {
    const draft = {
      id: `mock-draft-${Date.now()}`,
      service: input.service,
      title: `${input.service[0].toUpperCase()}${input.service.slice(1)} shipment draft`,
      progressLabel: "Draft in progress",
      updatedAt: "Just now",
      payload: { service: input.service, draft: input.draft } as Record<string, unknown>,
    };
    mockSavedDrafts.unshift(draft);
    return draft;
  },
  async submitBooking(input) {
    const result: BookingSubmissionResult = {
      id: `mock-booking-${Date.now()}`,
      reference: `NWC-${Math.floor(100000 + Math.random() * 899999)}`,
      service: input.service,
      status: input.service === "local" ? "received" : "quote_pending",
      message: input.service === "local" ? "Delivery request received." : "Quote request received.",
    };
    recordMockSubmittedBooking(result, input.draft);
    return result;
  },
};
