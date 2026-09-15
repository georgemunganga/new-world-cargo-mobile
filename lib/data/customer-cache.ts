import { QueryClient } from "@tanstack/react-query";

export function createCustomerQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        staleTime: 60_000,
        gcTime: 30 * 60_000,
        refetchOnReconnect: true,
        refetchOnWindowFocus: true,
      },
    },
  });
}
export type SavedCustomerCache = {
  owner: string;
  entries: { key: readonly unknown[]; data: unknown; updatedAt: number }[];
};
export function restoreCustomerCache(
  client: QueryClient,
  owner: string,
  saved: SavedCustomerCache | null,
  now = Date.now(),
) {
  if (saved?.owner !== owner || !Array.isArray(saved.entries)) return;
  for (const entry of saved.entries) {
    if (
      !Array.isArray(entry.key) ||
      !Number.isFinite(entry.updatedAt) ||
      now - entry.updatedAt > 86_400_000 ||
      entry.updatedAt > now
    )
      continue;
    const current = client.getQueryState(entry.key);
    if (!current?.dataUpdatedAt || current.dataUpdatedAt < entry.updatedAt)
      client.setQueryData(entry.key, entry.data, {
        updatedAt: entry.updatedAt,
      });
  }
}
