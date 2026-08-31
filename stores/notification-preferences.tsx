import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";

export type NotificationPreferences = {
  shipmentUpdates: boolean;
  billUpdates: boolean;
  marketing: boolean;
};

type NotificationContextValue = {
  preferences: NotificationPreferences;
  setPreference: (key: keyof NotificationPreferences, value: boolean) => void;
};

const NotificationPreferenceContext = createContext<NotificationContextValue | null>(null);

export const defaultNotificationPreferences: NotificationPreferences = { shipmentUpdates: true, billUpdates: true, marketing: false };

export function NotificationPreferenceProvider({ children }: PropsWithChildren) {
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const value = useMemo(() => ({ preferences, setPreference: (key: keyof NotificationPreferences, value: boolean) => setPreferences((current) => ({ ...current, [key]: value })) }), [preferences]);
  return <NotificationPreferenceContext.Provider value={value}>{children}</NotificationPreferenceContext.Provider>;
}

export function useNotificationPreferences() {
  const context = useContext(NotificationPreferenceContext);
  if (!context) throw new Error("useNotificationPreferences must be used within NotificationPreferenceProvider");
  return context;
}
