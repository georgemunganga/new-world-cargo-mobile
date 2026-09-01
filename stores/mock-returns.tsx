import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";

import { createMockReturnRequest, type MockReturnRequest, type ReturnHandover, type ReturnReason } from "@/lib/mock-returns";
import type { Shipment } from "@/types/cargo";

type MockReturnsContextValue = {
  requests: MockReturnRequest[];
  submitReturn: (shipment: Shipment, reason: ReturnReason, handover: ReturnHandover) => MockReturnRequest;
};

const MockReturnsContext = createContext<MockReturnsContextValue | null>(null);

export function MockReturnsProvider({ children }: PropsWithChildren) {
  const [requests, setRequests] = useState<MockReturnRequest[]>([]);
  const value = useMemo<MockReturnsContextValue>(() => ({
    requests,
    submitReturn: (shipment, reason, handover) => {
      const request = createMockReturnRequest(shipment, reason, handover);
      setRequests((existing) => [request, ...existing.filter((item) => item.shipmentId !== shipment.id)]);
      return request;
    },
  }), [requests]);
  return <MockReturnsContext.Provider value={value}>{children}</MockReturnsContext.Provider>;
}

export function useMockReturns() {
  const context = useContext(MockReturnsContext);
  if (!context) throw new Error("useMockReturns must be used within MockReturnsProvider");
  return context;
}
