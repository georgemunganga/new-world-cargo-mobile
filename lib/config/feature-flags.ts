import { mobileEnv } from "./env";

export const featureFlags = {
  useLaravelAuth: true,
  useLaravelShipments: true,
  useLaravelTracking: true,
  useLaravelBilling: true,
  useLaravelBillingActions: true,
  useLaravelBookings: true,
  useLaravelAddressBook: true,
  useLaravelSupport: true,
  useLaravelReturns: true,
  useLaravelPickups: true,
  useLaravelAccountSettings: true,
  enableNativeMaps: mobileEnv.mapsProvider !== "mock",
  enableLivePayments: mobileEnv.paymentsProvider !== "mock",
  enableObservability: !!mobileEnv.observabilityDsn || !!mobileEnv.apiBaseUrl,
};
