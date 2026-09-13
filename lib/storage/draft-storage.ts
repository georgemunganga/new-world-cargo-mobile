import type { BookingDraftSummary } from "@/lib/domain/booking";
import { readJsonStorage, writeJsonStorage } from "./json-storage";
import { storageKeys } from "./storage-keys";

export async function readStoredDraftSummaries() {
  return (await readJsonStorage<BookingDraftSummary[]>(storageKeys.bookingDrafts)) ?? [];
}

export function writeStoredDraftSummaries(drafts: BookingDraftSummary[]) {
  return writeJsonStorage(storageKeys.bookingDrafts, drafts);
}
