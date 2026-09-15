import type { ApiMode } from "@/lib/config/env";

export type RepositoryMode = ApiMode;

export function getRepositoryMode(): RepositoryMode {
  return "laravel";
}
