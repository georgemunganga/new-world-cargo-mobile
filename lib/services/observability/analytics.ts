import { featureFlags } from "@/lib/config/feature-flags";
import { redactSensitiveProperties, type RedactableProperties } from "./redaction";

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

export type AnalyticsProperties = RedactableProperties;

export const analytics = {
  track(name: AnalyticsEventName, properties: AnalyticsProperties = {}) {
    if (!featureFlags.enableObservability) return;
    console.info("[analytics]", name, redactSensitiveProperties(properties));
  },
};
