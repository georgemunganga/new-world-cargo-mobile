import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import type { StartupScenario } from "@/lib/startup-flow";

type StartupContextValue = {
  scenario: StartupScenario;
  setScenario: (scenario: StartupScenario) => void;
  resetScenario: () => void;
};

const AppStartupContext = createContext<StartupContextValue | null>(null);

export function AppStartupProvider({ children }: PropsWithChildren) {
  const [scenario, setScenario] = useState<StartupScenario>("normal");
  const value = useMemo(() => ({ scenario, setScenario, resetScenario: () => setScenario("normal") }), [scenario]);
  return <AppStartupContext.Provider value={value}>{children}</AppStartupContext.Provider>;
}

export function useAppStartup() {
  const context = useContext(AppStartupContext);
  if (!context) throw new Error("useAppStartup must be used within AppStartupProvider");
  return context;
}
