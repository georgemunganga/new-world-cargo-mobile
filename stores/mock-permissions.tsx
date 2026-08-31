import { createContext, useContext, useMemo, useState, type PropsWithChildren } from "react";
import type { MockPermission, MockPermissionStatus } from "@/lib/mock-permissions";

type PermissionContextValue = {
  statuses: Record<MockPermission, MockPermissionStatus>;
  setStatus: (permission: MockPermission, status: MockPermissionStatus) => void;
};

const PermissionContext = createContext<PermissionContextValue | null>(null);
const defaultStatuses: Record<MockPermission, MockPermissionStatus> = { location: "not_requested", camera: "not_requested", photos: "not_requested", contacts: "not_requested", notifications: "not_requested", biometrics: "not_requested" };

export function MockPermissionProvider({ children }: PropsWithChildren) {
  const [statuses, setStatuses] = useState(defaultStatuses);
  const value = useMemo(() => ({ statuses, setStatus: (permission: MockPermission, status: MockPermissionStatus) => setStatuses((current) => ({ ...current, [permission]: status })) }), [statuses]);
  return <PermissionContext.Provider value={value}>{children}</PermissionContext.Provider>;
}

export function useMockPermissions() {
  const context = useContext(PermissionContext);
  if (!context) throw new Error("useMockPermissions must be used within MockPermissionProvider");
  return context;
}
