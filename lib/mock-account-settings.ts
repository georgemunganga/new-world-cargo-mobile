import { accountPolicySummaries, type RecognizedDevice } from "@/lib/domain/account-settings";

export type MockRecognizedDevice = RecognizedDevice;

export const mockRecognizedDevices: MockRecognizedDevice[] = [
  { id: "this-device", name: "This phone", detail: "Lusaka · Active now", current: true },
  { id: "web-preview", name: "Browser preview", detail: "Lusaka · Last active today" },
  { id: "previous-phone", name: "Previous phone", detail: "Kitwe · Last active 12 Aug" },
];

export { accountPolicySummaries };
