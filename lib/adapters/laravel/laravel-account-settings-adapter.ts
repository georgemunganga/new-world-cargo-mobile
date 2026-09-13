import type { AccountSettingsRepository } from "@/lib/repositories/types";
import { missingPortalContract } from "./portal-contract-gap";

export const laravelAccountSettingsRepository: AccountSettingsRepository = {
  async getSettings() {
    missingPortalContract("Account settings snapshot");
  },
  async revokeDevice(id) {
    void id;
    missingPortalContract("Recognized device revocation");
  },
  async setMarketingEnabled(enabled) {
    void enabled;
    missingPortalContract("Marketing preference updates");
  },
  async requestDataExport() {
    missingPortalContract("Customer data export request");
  },
  async requestAccountDeletion() {
    missingPortalContract("Customer account deletion request");
  },
};
