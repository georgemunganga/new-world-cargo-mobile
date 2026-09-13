import { featureFlags } from "@/lib/config/feature-flags";
import { MobileApiError } from "@/lib/api/errors";

export type ErrorContext = Record<string, string | number | boolean | null | undefined>;

function safeContext(context: ErrorContext = {}) {
  return Object.fromEntries(
    Object.entries(context).filter(([key]) => !/token|password|phone|email|address/i.test(key)),
  );
}

export const errorReporter = {
  capture(error: unknown, context: ErrorContext = {}) {
    if (!featureFlags.enableObservability) return;
    const message = error instanceof Error ? error.message : "Unknown error";
    const code = error instanceof MobileApiError ? error.code : "UNKNOWN";
    console.error("[error]", { message, code, context: safeContext(context) });
  },
};
