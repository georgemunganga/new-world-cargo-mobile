import { apiClient } from "@/lib/api/client";
import type { AccountSettingsSnapshot, RecognizedDevice } from "@/lib/domain/account-settings";
import type { AccountSettingsRepository } from "@/lib/repositories/types";

type LaravelAccountSettingsResponse = {
  devices?: RecognizedDevice[];
  recognized_devices?: RecognizedDevice[];
  marketingEnabled?: boolean;
  marketing_enabled?: boolean;
  dataExportRequested?: boolean;
  data_export_requested?: boolean;
  deletionRequested?: boolean;
  deletion_requested?: boolean;
};

function mapSettings(raw: LaravelAccountSettingsResponse): AccountSettingsSnapshot {
  return {
    devices: raw.devices ?? raw.recognized_devices ?? [],
    marketingEnabled: raw.marketingEnabled ?? raw.marketing_enabled ?? false,
    dataExportRequested: raw.dataExportRequested ?? raw.data_export_requested ?? false,
    deletionRequested: raw.deletionRequested ?? raw.deletion_requested ?? false,
  };
}

export const laravelAccountSettingsRepository: AccountSettingsRepository = {
  async getSettings() {
    const response = await apiClient.get<{ data: LaravelAccountSettingsResponse }>("/api/customer/account/settings");
    return mapSettings(response.data);
  },
  async revokeDevice(id) {
    const response = await apiClient.delete<{ data: LaravelAccountSettingsResponse }>(`/api/customer/account/devices/${encodeURIComponent(id)}`);
    return mapSettings(response.data);
  },
  async setMarketingEnabled(enabled) {
    const response = await apiClient.patch<{ data: LaravelAccountSettingsResponse }>("/api/customer/account/marketing", { enabled });
    return mapSettings(response.data);
  },
  async requestDataExport() {
    const response = await apiClient.post<{ data: LaravelAccountSettingsResponse }>("/api/customer/account/data-export");
    return mapSettings(response.data);
  },
  async requestAccountDeletion() {
    const response = await apiClient.post<{ data: LaravelAccountSettingsResponse }>("/api/customer/account/deletion-request");
    return mapSettings(response.data);
  },
};
