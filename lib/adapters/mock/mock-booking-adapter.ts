import { mockBookingDraftRecords } from "@/lib/mock-booking-drafts";
import type { BookingRepository } from "@/lib/repositories/types";

export const mockBookingRepository: BookingRepository = {
  async listDrafts() {
    return mockBookingDraftRecords.map((draft) => ({
      id: draft.id,
      service: draft.service,
      title: draft.title,
      progressLabel: `${draft.stepLabel} · ${draft.progress}`,
      updatedAt: draft.updatedAt,
      payload: draft.payload,
    }));
  },
  async submitBooking(input) {
    return {
      id: `mock-booking-${Date.now()}`,
      reference: `NWC-${Math.floor(100000 + Math.random() * 899999)}`,
      service: input.service,
      status: input.service === "local" ? "received" : "quote_pending",
      message: input.service === "local" ? "Delivery request received." : "Quote request received.",
    };
  },
};
