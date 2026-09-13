import { apiClient } from "@/lib/api/client";
import type { AccountSettingsSnapshot } from "@/lib/domain/account-settings";
import type { AccountSettingsRepository } from "@/lib/repositories/types";

type LaravelAccountSettingsResponse = AccountSettingsSnapshot & {
  customerId?: string;
  revision?: number;
};

function mapSettings(raw: LaravelAccountSettingsResponse): AccountSettingsSnapshot {
  return {
    devices: raw.devices ?? [],
    marketingEnabled: Boolean(raw.marketingEnabled),
    dataExportRequested: Boolean(raw.dataExportRequested),
    deletionRequested: Boolean(raw.deletionRequested),
  };
}

export const laravelAccountSettingsRepository: AccountSettingsRepository = {
  async getSettings() {
    const response = await apiClient.get<{ data: LaravelAccountSettingsResponse }>("/api/v1/account/settings");
    return mapSettings(response.data);
  },
  async revokeDevice(id) {
    const response = await apiClient.delete<{ data: LaravelAccountSettingsResponse }>(`/api/v1/account/devices/${encodeURIComponent(id)}`);
    return mapSettings(response.data);
  },
  async setMarketingEnabled(enabled) {
    const response = await apiClient.patch<{ data: LaravelAccountSettingsResponse }>("/api/v1/account/marketing", { enabled });
    return mapSettings(response.data);
  },
  async requestDataExport() {
    const response = await apiClient.post<{ data: LaravelAccountSettingsResponse }>("/api/v1/account/data-export");
    return mapSettings(response.data);
  },
  async requestAccountDeletion() {
    const response = await apiClient.post<{ data: LaravelAccountSettingsResponse }>("/api/v1/account/deletion-request");
    return mapSettings(response.data);
  },
};
