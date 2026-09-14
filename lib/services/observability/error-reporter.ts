import { featureFlags } from "@/lib/config/feature-flags";
import { MobileApiError } from "@/lib/api/errors";
import { redactSensitiveProperties, redactSensitiveText, type RedactableProperties } from "./redaction";
import { sendTelemetry } from "./telemetry-client";

export type ErrorContext = RedactableProperties;

export const errorReporter = {
  capture(error: unknown, context: ErrorContext = {}) {
    if (!featureFlags.enableObservability) return;
    const message = redactSensitiveText(error instanceof Error ? error.message : "Unknown error");
    const code = error instanceof MobileApiError ? error.code : "UNKNOWN";
    const requestId = error instanceof MobileApiError ? error.options.requestId : undefined;
    sendTelemetry("api_error_occurred", { message, code, requestId, ...redactSensitiveProperties(context) });
  },
};
