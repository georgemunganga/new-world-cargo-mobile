export type RecognizedDevice = {
  id: string;
  name: string;
  detail: string;
  current?: boolean;
};

export type AccountSettingsSnapshot = {
  devices: RecognizedDevice[];
  marketingEnabled: boolean;
  dataExportRequested: boolean;
  deletionRequested: boolean;
};

export const accountPolicySummaries = [
  { id: "terms", title: "Terms of service", detail: "How New WorldCargo services and customer responsibilities work." },
  { id: "privacy", title: "Privacy policy", detail: "How account, route, and shipment information is handled." },
  { id: "payments", title: "Payment and refund policy", detail: "Billing, wallet, proof, refund, and dispute information." },
];

export function removeRecognizedDevice(devices: RecognizedDevice[], id: string) {
  return devices.filter((device) => device.id !== id || device.current);
}
