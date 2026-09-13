import { removeRecognizedDevice, type AccountSettingsSnapshot } from "@/lib/domain/account-settings";
import { mockRecognizedDevices } from "@/lib/mock-account-settings";
import type { AccountSettingsRepository } from "@/lib/repositories/types";

let snapshot: AccountSettingsSnapshot = {
  devices: [...mockRecognizedDevices],
  marketingEnabled: true,
  dataExportRequested: false,
  deletionRequested: false,
};

export const mockAccountSettingsRepository: AccountSettingsRepository = {
  async getSettings() {
    return snapshot;
  },
  async revokeDevice(id) {
    snapshot = { ...snapshot, devices: removeRecognizedDevice(snapshot.devices, id) };
    return snapshot;
  },
  async setMarketingEnabled(enabled) {
    snapshot = { ...snapshot, marketingEnabled: enabled };
    return snapshot;
  },
  async requestDataExport() {
    snapshot = { ...snapshot, dataExportRequested: true };
    return snapshot;
  },
  async requestAccountDeletion() {
    snapshot = { ...snapshot, deletionRequested: true };
    return snapshot;
  },
};
