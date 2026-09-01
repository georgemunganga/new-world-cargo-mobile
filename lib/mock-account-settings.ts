export type MockRecognizedDevice = { id: string; name: string; detail: string; current?: boolean };

export const mockRecognizedDevices: MockRecognizedDevice[] = [
  { id: "this-device", name: "This phone", detail: "Lusaka · Active now", current: true },
  { id: "web-preview", name: "Browser preview", detail: "Lusaka · Last active today" },
  { id: "previous-phone", name: "Previous phone", detail: "Kitwe · Last active 12 Aug" },
];

export const accountPolicySummaries = [
  { id: "terms", title: "Terms of service", detail: "How New WorldCargo services and customer responsibilities work." },
  { id: "privacy", title: "Privacy policy", detail: "How account, route, and shipment information is handled." },
  { id: "payments", title: "Payment and refund policy", detail: "Billing, wallet, proof, refund, and dispute information." },
];
