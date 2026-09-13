import { mobileEnv, type ApiMode } from "@/lib/config/env";

export type RepositoryMode = ApiMode;

export function getRepositoryMode(): RepositoryMode {
  return mobileEnv.apiMode;
}

export function shouldUseLaravel(featureEnabled: boolean) {
  const mode = getRepositoryMode();
  return mode === "laravel" || (mode === "hybrid" && featureEnabled);
}
