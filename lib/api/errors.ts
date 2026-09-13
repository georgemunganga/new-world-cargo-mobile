export type MobileApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHENTICATED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "VALIDATION_FAILED"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "NETWORK_UNAVAILABLE"
  | "TIMEOUT"
  | "UNKNOWN";

export type FieldErrors = Record<string, string[]>;

export class MobileApiError extends Error {
  constructor(
    public readonly code: MobileApiErrorCode,
    message: string,
    public readonly options: { status?: number; fieldErrors?: FieldErrors; requestId?: string; retryable?: boolean } = {},
  ) {
    super(message);
    this.name = "MobileApiError";
  }
}

export function apiCodeFromStatus(status: number): MobileApiErrorCode {
  if (status === 400) return "BAD_REQUEST";
  if (status === 401) return "UNAUTHENTICATED";
  if (status === 403) return "FORBIDDEN";
  if (status === 404) return "NOT_FOUND";
  if (status === 409) return "CONFLICT";
  if (status === 422) return "VALIDATION_FAILED";
  if (status === 429) return "RATE_LIMITED";
  if (status >= 500) return "SERVER_ERROR";
  return "UNKNOWN";
}

export function customerSafeMessageFor(error: unknown) {
  if (error instanceof MobileApiError) return error.message;
  if (error instanceof Error && error.message.trim()) return error.message;
  return "Something went wrong. Please try again.";
}
