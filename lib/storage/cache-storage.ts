import { readJsonStorage, removeJsonStorage, writeJsonStorage } from "./json-storage";

export type CacheRecord<T> = {
  value: T;
  savedAt: string;
  staleAfterMs: number;
};

export async function readCache<T>(key: string): Promise<{ value: T; isStale: boolean } | null> {
  const record = await readJsonStorage<CacheRecord<T>>(key);
  if (!record) return null;
  const ageMs = Date.now() - new Date(record.savedAt).getTime();
  return { value: record.value, isStale: ageMs > record.staleAfterMs };
}

export function writeCache<T>(key: string, value: T, staleAfterMs = 5 * 60 * 1000) {
  return writeJsonStorage<CacheRecord<T>>(key, { value, savedAt: new Date().toISOString(), staleAfterMs });
}

export function clearCache(key: string) {
  return removeJsonStorage(key);
}
