import NetInfo from "@react-native-community/netinfo";
import { createContext, useContext, useEffect, useMemo, useRef, useState, type PropsWithChildren } from "react";
import type { StartupScenario } from "@/lib/startup-flow";

type StartupContextValue = {
  scenario: StartupScenario;
  setScenario: (scenario: StartupScenario) => void;
  resetScenario: () => void;
};

const AppStartupContext = createContext<StartupContextValue | null>(null);

export function AppStartupProvider({ children }: PropsWithChildren) {
  const [scenario, setScenario] = useState<StartupScenario>("normal");
  const [networkOffline, setNetworkOffline] = useState(false);
  const [offlineAcknowledged, setOfflineAcknowledged] = useState(false);
  const previousOffline = useRef(false);

  useEffect(() => NetInfo.addEventListener((state) => {
    const offline = state.isConnected === false || state.isInternetReachable === false;
    if (offline && !previousOffline.current) setOfflineAcknowledged(false);
    if (!offline) setOfflineAcknowledged(false);
    previousOffline.current = offline;
    setNetworkOffline(offline);
  }), []);

  const effectiveScenario = networkOffline && !offlineAcknowledged ? "offline" : scenario;
  const value = useMemo(() => ({
    scenario: effectiveScenario,
    setScenario,
    resetScenario: () => {
      setScenario("normal");
      if (networkOffline) setOfflineAcknowledged(true);
    },
  }), [effectiveScenario, networkOffline]);
  return <AppStartupContext.Provider value={value}>{children}</AppStartupContext.Provider>;
}

export function useAppStartup() {
  const context = useContext(AppStartupContext);
  if (!context) throw new Error("useAppStartup must be used within AppStartupProvider");
  return context;
}
