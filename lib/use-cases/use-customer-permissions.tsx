import { createContext, useCallback, useContext, useEffect, useMemo, useState, type PropsWithChildren } from "react";
import { permissionService, type DevicePermission } from "@/lib/services/device/permission-service";
import type { CustomerPermission, CustomerPermissionStatus } from "@/lib/domain/permission";

const defaultStatuses: Record<CustomerPermission, CustomerPermissionStatus> = {
  location: "not_requested",
  camera: "not_requested",
  photos: "not_requested",
  contacts: "not_requested",
  notifications: "not_requested",
  biometrics: "not_requested",
};

const nativePermissionFor: Record<CustomerPermission, DevicePermission | null> = {
  location: "location",
  camera: "camera",
  photos: "photos",
  contacts: "contacts",
  notifications: "notifications",
  biometrics: "biometrics",
};

function statusFromNative(status: Awaited<ReturnType<typeof permissionService.request>>): CustomerPermissionStatus {
  if (status === "granted") return "granted";
  if (status === "denied") return "denied";
  if (status === "unavailable") return "denied";
  return "not_requested";
}

type CustomerPermissionContextValue = {
  statuses: Record<CustomerPermission, CustomerPermissionStatus>;
  setStatus: (permission: CustomerPermission, status: CustomerPermissionStatus) => void;
  requestPermission: (permission: CustomerPermission) => Promise<CustomerPermissionStatus>;
};

const CustomerPermissionContext = createContext<CustomerPermissionContextValue | null>(null);

export function CustomerPermissionProvider({ children }: PropsWithChildren) {
  const [statuses, setStatuses] = useState(defaultStatuses);

  useEffect(() => {
    let active = true;
    void Promise.all(
      (Object.keys(nativePermissionFor) as CustomerPermission[]).map(async (permission) => {
        const nativePermission = nativePermissionFor[permission];
        if (!nativePermission) return [permission, "not_requested"] as const;
        const status = statusFromNative(await permissionService.getStatus(nativePermission));
        return [permission, status] as const;
      }),
    ).then((entries) => {
      if (active) setStatuses(Object.fromEntries(entries) as Record<CustomerPermission, CustomerPermissionStatus>);
    });
    return () => {
      active = false;
    };
  }, []);

  const setStatus = useCallback((permission: CustomerPermission, status: CustomerPermissionStatus) => {
    setStatuses((current) => ({ ...current, [permission]: status }));
  }, []);

  const requestPermission = useCallback(async (permission: CustomerPermission) => {
    const nativePermission = nativePermissionFor[permission];
    const status = nativePermission ? statusFromNative(await permissionService.request(nativePermission)) : "granted";
    setStatus(permission, status);
    return status;
  }, [setStatus]);

  const value = useMemo(() => ({ statuses, setStatus, requestPermission }), [requestPermission, setStatus, statuses]);
  return <CustomerPermissionContext.Provider value={value}>{children}</CustomerPermissionContext.Provider>;
}

export function useCustomerPermissions() {
  const context = useContext(CustomerPermissionContext);
  if (!context) throw new Error("useCustomerPermissions must be used within CustomerPermissionProvider");
  return context;
}
