export type BookingService = "import" | "intercity" | "local" | "custom";

export type BookingDraftSummary = {
  id: string;
  service: BookingService;
  title: string;
  progressLabel: string;
  updatedAt: string;
  payload?: unknown;
};

export type BookingSubmissionInput = {
  service: BookingService;
  draft: unknown;
};

export type BookingSubmissionResult = {
  id: string;
  reference: string;
  service: BookingService;
  status: "received" | "quote_pending" | "confirmed";
  message: string;
};
