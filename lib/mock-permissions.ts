import { customerPermissions, permissionStatusLabel, type CustomerPermission, type CustomerPermissionStatus } from "@/lib/domain/permission";

export type MockPermission = CustomerPermission;
export type MockPermissionStatus = CustomerPermissionStatus;

export const mockPermissions = customerPermissions;

export { permissionStatusLabel };
