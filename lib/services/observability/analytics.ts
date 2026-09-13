import { featureFlags } from "@/lib/config/feature-flags";

export type AnalyticsEventName =
  | "app_opened"
  | "session_restored"
  | "login_attempted"
  | "login_failed"
  | "shipment_list_opened"
  | "tracking_search_submitted"
  | "booking_draft_created"
  | "booking_submitted"
  | "invoice_opened"
  | "payment_attempted"
  | "payment_completed"
  | "support_case_submitted"
  | "api_error_occurred"
  | "native_permission_denied";

export type AnalyticsProperties = Record<string, string | number | boolean | null | undefined>;

function sanitizeProperties(properties: AnalyticsProperties = {}) {
  return Object.fromEntries(
    Object.entries(properties).filter(([key]) => !/token|password|phone|email|address/i.test(key)),
  );
}

export const analytics = {
  track(name: AnalyticsEventName, properties: AnalyticsProperties = {}) {
    if (!featureFlags.enableObservability) return;
    console.info("[analytics]", name, sanitizeProperties(properties));
  },
};
