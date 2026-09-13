import type { AuthSession } from "@/lib/domain/auth";
import { readJsonStorage, removeJsonStorage, writeJsonStorage } from "./json-storage";
import { storageKeys } from "./storage-keys";

export function readSecureSession() {
  return readJsonStorage<AuthSession>(storageKeys.customerSession, "secure");
}

export function writeSecureSession(session: AuthSession) {
  return writeJsonStorage(storageKeys.customerSession, session, "secure");
}

export function clearSecureSession() {
  return removeJsonStorage(storageKeys.customerSession, "secure");
}
