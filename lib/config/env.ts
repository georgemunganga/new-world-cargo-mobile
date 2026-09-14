export type ApiMode = "mock" | "hybrid" | "laravel";
export type AppEnvironment = "development" | "staging" | "production";

const readPublicEnv = (key: string) => process.env[key]?.trim() ?? "";

const normalizeApiMode = (value: string): ApiMode => {
  if (value === "hybrid" || value === "laravel") return value;
  return "mock";
};

const normalizeAppEnvironment = (value: string): AppEnvironment => {
  if (value === "staging" || value === "production") return value;
  return "development";
};

export const mobileEnv = {
  appEnvironment: normalizeAppEnvironment(readPublicEnv("EXPO_PUBLIC_APP_ENV")),
  apiMode: normalizeApiMode(readPublicEnv("EXPO_PUBLIC_API_MODE")),
  apiBaseUrl: readPublicEnv("EXPO_PUBLIC_API_BASE_URL").replace(/\/$/, ""),
  publicTrackingBaseUrl: readPublicEnv("EXPO_PUBLIC_PUBLIC_TRACKING_BASE_URL").replace(/\/$/, ""),
  expoProjectId: readPublicEnv("EXPO_PUBLIC_EXPO_PROJECT_ID"),
  observabilityDsn: readPublicEnv("EXPO_PUBLIC_OBSERVABILITY_DSN"),
  mapsProvider: readPublicEnv("EXPO_PUBLIC_MAPS_PROVIDER") || "mock",
  paymentsProvider: readPublicEnv("EXPO_PUBLIC_PAYMENTS_PROVIDER") || "mock",
  googleMapsApiKey: readPublicEnv("EXPO_PUBLIC_GOOGLE_MAPS_API_KEY"),
};

export function assertProductionEnvReady() {
  if (mobileEnv.appEnvironment !== "production") return;
  const missing = [
    !mobileEnv.apiBaseUrl ? "EXPO_PUBLIC_API_BASE_URL" : "",
    !mobileEnv.publicTrackingBaseUrl ? "EXPO_PUBLIC_PUBLIC_TRACKING_BASE_URL" : "",
    mobileEnv.apiMode !== "laravel" ? "EXPO_PUBLIC_API_MODE=laravel" : "",
    mobileEnv.mapsProvider !== "native" ? "EXPO_PUBLIC_MAPS_PROVIDER=native" : "",
    mobileEnv.paymentsProvider !== "laravel" ? "EXPO_PUBLIC_PAYMENTS_PROVIDER=laravel" : "",
    !mobileEnv.googleMapsApiKey ? "EXPO_PUBLIC_GOOGLE_MAPS_API_KEY" : "",
    !mobileEnv.expoProjectId ? "EXPO_PUBLIC_EXPO_PROJECT_ID" : "",
  ].filter(Boolean);
  if (missing.length) throw new Error(`Missing production mobile environment values: ${missing.join(", ")}`);
}
