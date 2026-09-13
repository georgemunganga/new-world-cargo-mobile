export type DevicePermission = "camera" | "location" | "notifications" | "photos" | "files" | "biometrics";
export type DevicePermissionStatus = "granted" | "denied" | "undetermined" | "unavailable";

export type PermissionService = {
  getStatus(permission: DevicePermission): Promise<DevicePermissionStatus>;
  request(permission: DevicePermission): Promise<DevicePermissionStatus>;
};

export const permissionService: PermissionService = {
  async getStatus() {
    return "undetermined";
  },
  async request() {
    return "unavailable";
  },
};
