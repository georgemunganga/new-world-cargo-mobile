import type { MobileApiError } from "./errors";

export type SessionExpiredListener = (error: MobileApiError) => void;

const listeners = new Set<SessionExpiredListener>();

export function addSessionExpiredListener(listener: SessionExpiredListener) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function notifySessionExpired(error: MobileApiError) {
  listeners.forEach((listener) => listener(error));
}
