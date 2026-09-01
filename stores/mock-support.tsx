import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import { mockSupportCases, type MockSupportCase } from "@/lib/mock-support";

type MockSupportContextValue = { cases: MockSupportCase[]; startSupportCase: (topic: string, detail: string) => string };
const MockSupportContext = createContext<MockSupportContextValue | null>(null);

export function MockSupportProvider({ children }: PropsWithChildren) {
  const [cases, setCases] = useState(mockSupportCases);
  const startSupportCase = (topic: string, detail: string) => { const id = `case-${Date.now()}`; setCases((current) => [{ id, title: topic, detail, status: "open", updatedAt: "Just now", events: [{ label: "Request created", detail: "Your request is ready for a future support connection.", time: "Just now" }, { label: "New WorldCargo review", detail: "A mock team update will appear here.", time: "Next update pending" }] }, ...current]); return id; };
  const value = useMemo(() => ({ cases, startSupportCase }), [cases]);
  return <MockSupportContext.Provider value={value}>{children}</MockSupportContext.Provider>;
}

export function useMockSupport() { const context = useContext(MockSupportContext); if (!context) throw new Error("useMockSupport must be used within MockSupportProvider"); return context; }
