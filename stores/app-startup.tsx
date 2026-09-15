import NetInfo from "@react-native-community/netinfo";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import type { StartupScenario } from "@/lib/startup-flow";
import { readJsonStorage, writeJsonStorage } from "@/lib/storage/json-storage";
import { storageKeys } from "@/lib/storage/storage-keys";

type StartupContextValue = {
  scenario: StartupScenario;
  hasCompletedOnboarding: boolean;
  isRestoringOnboarding: boolean;
  completeOnboarding: () => Promise<void>;
  setScenario: (scenario: StartupScenario) => void;
  resetScenario: () => void;
};

const AppStartupContext = createContext<StartupContextValue | null>(null);

export function AppStartupProvider({ children }: PropsWithChildren) {
  const [scenario, setScenario] = useState<StartupScenario>("normal");
  const [networkOffline, setNetworkOffline] = useState(false);
  const [offlineAcknowledged, setOfflineAcknowledged] = useState(false);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const [isRestoringOnboarding, setIsRestoringOnboarding] = useState(true);
  const previousOffline = useRef(false);

  useEffect(() => {
    let active = true;
    void readJsonStorage<boolean>(storageKeys.onboardingComplete)
      .then((completed) => {
        if (active) setHasCompletedOnboarding(completed === true);
      })
      .catch(() => {
        if (active) setHasCompletedOnboarding(false);
      })
      .finally(() => {
        if (active) setIsRestoringOnboarding(false);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => NetInfo.addEventListener((state) => {
    const offline = state.isConnected === false || state.isInternetReachable === false;
    if (offline && !previousOffline.current) setOfflineAcknowledged(false);
    if (!offline) setOfflineAcknowledged(false);
    previousOffline.current = offline;
    setNetworkOffline(offline);
  }), []);

  const completeOnboarding = useCallback(async () => {
    await writeJsonStorage(storageKeys.onboardingComplete, true);
    setHasCompletedOnboarding(true);
  }, []);

  const effectiveScenario = networkOffline && !offlineAcknowledged ? "offline" : scenario;
  const value = useMemo(() => ({
    scenario: effectiveScenario,
    hasCompletedOnboarding,
    isRestoringOnboarding,
    completeOnboarding,
    setScenario,
    resetScenario: () => {
      setScenario("normal");
      if (networkOffline) setOfflineAcknowledged(true);
    },
  }), [completeOnboarding, effectiveScenario, hasCompletedOnboarding, isRestoringOnboarding, networkOffline]);
  return <AppStartupContext.Provider value={value}>{children}</AppStartupContext.Provider>;
}

export function useAppStartup() {
  const context = useContext(AppStartupContext);
  if (!context) throw new Error("useAppStartup must be used within AppStartupProvider");
  return context;
}
