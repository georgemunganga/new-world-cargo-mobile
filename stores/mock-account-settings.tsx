import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import { mockRecognizedDevices, type MockRecognizedDevice } from "@/lib/mock-account-settings";

type MockAccountSettingsContextValue = { devices: MockRecognizedDevice[]; marketingEnabled: boolean; dataExportRequested: boolean; deletionRequested: boolean; revokeDevice: (id: string) => void; setMarketingEnabled: (enabled: boolean) => void; requestDataExport: () => void; requestAccountDeletion: () => void };
const MockAccountSettingsContext = createContext<MockAccountSettingsContextValue | null>(null);

export function MockAccountSettingsProvider({ children }: PropsWithChildren) {
  const [devices, setDevices] = useState(mockRecognizedDevices);
  const [marketingEnabled, setMarketingEnabled] = useState(true);
  const [dataExportRequested, setDataExportRequested] = useState(false);
  const [deletionRequested, setDeletionRequested] = useState(false);
  const value = useMemo(() => ({ devices, marketingEnabled, dataExportRequested, deletionRequested, revokeDevice: (id: string) => setDevices((items) => items.filter((device) => device.id !== id || device.current)), setMarketingEnabled, requestDataExport: () => setDataExportRequested(true), requestAccountDeletion: () => setDeletionRequested(true) }), [dataExportRequested, deletionRequested, devices, marketingEnabled]);
  return <MockAccountSettingsContext.Provider value={value}>{children}</MockAccountSettingsContext.Provider>;
}

export function useMockAccountSettings() {
  const context = useContext(MockAccountSettingsContext);
  if (!context) throw new Error("useMockAccountSettings must be used within MockAccountSettingsProvider");
  return context;
}
