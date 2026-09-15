import { createContext, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import { defaultNotificationPreferences } from "@/lib/domain/notifications";
import type { NotificationPreferences } from "@/lib/domain/notifications";
import { repositories } from "@/lib/repositories";
import { useCustomerAuth } from "@/stores/customer-auth";

export { defaultNotificationPreferences } from "@/lib/domain/notifications";

type NotificationContextValue = {
  preferences: NotificationPreferences;
  status: "idle" | "loading" | "success" | "error" | "saving";
  errorMessage: string;
  pushRegistered: boolean;
  setPreference: (key: keyof NotificationPreferences, value: boolean) => void;
  setAllPreferences: (value: boolean) => void;
  savePreferences: (nextPreferences?: NotificationPreferences) => Promise<boolean>;
  enablePushNotifications: () => Promise<boolean>;
};

const NotificationPreferenceContext = createContext<NotificationContextValue | null>(null);

export function NotificationPreferenceProvider({ children }: PropsWithChildren) {
  const { customer, isRestoring } = useCustomerAuth();
  const [preferences, setPreferences] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const [lastSaved, setLastSaved] = useState<NotificationPreferences>(defaultNotificationPreferences);
  const [pushRegistered, setPushRegistered] = useState(false);
  const [status, setStatus] = useState<NotificationContextValue["status"]>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isRestoring) return;
    if (!customer) {
      setPreferences(defaultNotificationPreferences);
      setLastSaved(defaultNotificationPreferences);
      setPushRegistered(false);
      setStatus("idle");
      setErrorMessage("");
      return;
    }
    let active = true;
    setStatus("loading");
    void repositories.notificationPreferences.getPreferences()
      .then((snapshot) => {
        if (!active) return;
        const next = {
          shipmentUpdates: snapshot.shipmentUpdates,
          billUpdates: snapshot.billUpdates,
          marketing: snapshot.marketing,
        };
        setPreferences(next);
        setLastSaved(next);
        setPushRegistered(Boolean(snapshot.pushRegistered));
        setStatus("success");
      })
      .catch((error) => {
        if (!active) return;
        setErrorMessage(customerSafeMessageFor(error));
        setStatus("error");
      });
    return () => {
      active = false;
    };
  }, [customer?.id, isRestoring]);

  const value = useMemo(() => ({
    preferences,
    status,
    errorMessage,
    pushRegistered,
    setPreference: (key: keyof NotificationPreferences, value: boolean) => setPreferences((current) => ({ ...current, [key]: value })),
    setAllPreferences: (value: boolean) => setPreferences({ shipmentUpdates: value, billUpdates: value, marketing: value }),
    savePreferences: async (nextPreferences?: NotificationPreferences) => {
      const preferencesToSave = nextPreferences ?? preferences;
      setStatus("saving");
      setErrorMessage("");
      try {
        const snapshot = await repositories.notificationPreferences.updatePreferences(preferencesToSave);
        const next = {
          shipmentUpdates: snapshot.shipmentUpdates,
          billUpdates: snapshot.billUpdates,
          marketing: snapshot.marketing,
        };
        setPreferences(next);
        setLastSaved(next);
        setPushRegistered(Boolean(snapshot.pushRegistered));
        setStatus("success");
        return true;
      } catch (error) {
        setPreferences(lastSaved);
        setErrorMessage(customerSafeMessageFor(error));
        setStatus("error");
        return false;
      }
    },
    enablePushNotifications: async () => {
      setStatus("saving");
      setErrorMessage("");
      try {
        const snapshot = await repositories.notificationPreferences.registerPushToken();
        setPushRegistered(Boolean(snapshot.pushRegistered));
        setStatus("success");
        return Boolean(snapshot.pushRegistered);
      } catch (error) {
        setErrorMessage(customerSafeMessageFor(error));
        setStatus("error");
        return false;
      }
    },
  }), [errorMessage, lastSaved, preferences, pushRegistered, status]);
  return <NotificationPreferenceContext.Provider value={value}>{children}</NotificationPreferenceContext.Provider>;
}

export function useNotificationPreferences() {
  const context = useContext(NotificationPreferenceContext);
  if (!context) throw new Error("useNotificationPreferences must be used within NotificationPreferenceProvider");
  return context;
}
