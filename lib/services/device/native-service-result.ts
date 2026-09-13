export type NativeUnavailableReason = "browser-preview" | "missing-native-module" | "permission-denied" | "cancelled" | "not-configured" | "unknown";

export type NativeServiceResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: NativeUnavailableReason; message: string };

export function nativeSuccess<T>(value: T): NativeServiceResult<T> {
  return { ok: true, value };
}

export function nativeUnavailable<T = never>(reason: NativeUnavailableReason, message: string): NativeServiceResult<T> {
  return { ok: false, reason, message };
}

export function customerMessageForNativeResult(result: NativeServiceResult<unknown>) {
  return result.ok ? "" : result.message;
}
