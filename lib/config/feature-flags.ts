import { mobileEnv } from "./env";

export const featureFlags = {
  useLaravelAuth: mobileEnv.apiMode === "laravel" || mobileEnv.apiMode === "hybrid",
  useLaravelShipments: mobileEnv.apiMode === "laravel",
  useLaravelTracking: mobileEnv.apiMode === "laravel" || mobileEnv.apiMode === "hybrid",
  useLaravelBilling: mobileEnv.apiMode === "laravel",
  useLaravelBillingActions: mobileEnv.apiMode === "laravel",
  useLaravelBookings: mobileEnv.apiMode === "laravel",
  useLaravelAddressBook: mobileEnv.apiMode === "laravel",
  useLaravelSupport: mobileEnv.apiMode === "laravel",
  useLaravelReturns: mobileEnv.apiMode === "laravel",
  useLaravelPickups: mobileEnv.apiMode === "laravel",
  useLaravelAccountSettings: mobileEnv.apiMode === "laravel",
  enableNativeMaps: mobileEnv.mapsProvider !== "mock",
  enableLivePayments: mobileEnv.paymentsProvider !== "mock",
  enableObservability: !!mobileEnv.observabilityDsn || (!!mobileEnv.apiBaseUrl && mobileEnv.apiMode !== "mock"),
};
