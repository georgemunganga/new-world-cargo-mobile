import { apiClient } from "@/lib/api/client";
import type { BookingDraftSummary, BookingSubmissionResult } from "@/lib/domain/booking";
import type { BookingRepository } from "@/lib/repositories/types";

export const laravelBookingRepository: BookingRepository = {
  async listDrafts() {
    const response = await apiClient.get<{ data: BookingDraftSummary[] }>("/api/customer/bookings/drafts");
    return response.data;
  },
  async submitBooking(input) {
    const response = await apiClient.post<{ data: BookingSubmissionResult }>("/api/customer/bookings", input);
    return response.data;
  },
};
