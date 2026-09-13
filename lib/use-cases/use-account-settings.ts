import { useCallback, useEffect, useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { AccountSettingsSnapshot } from "@/lib/domain/account-settings";
import { repositories } from "@/lib/repositories";

const emptySettings: AccountSettingsSnapshot = { devices: [], marketingEnabled: false, dataExportRequested: false, deletionRequested: false };

export function useAccountSettings() {
  const [settings, setSettings] = useState<AccountSettingsSnapshot>(emptySettings);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error" | "updating">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const refresh = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      setSettings(await repositories.accountSettings.getSettings());
      setStatus("success");
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const update = useCallback(async (action: () => Promise<AccountSettingsSnapshot>) => {
    setStatus("updating");
    setErrorMessage("");
    try {
      const next = await action();
      setSettings(next);
      setStatus("success");
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
    }
  }, []);

  return {
    ...settings,
    status,
    errorMessage,
    refresh,
    revokeDevice: (id: string) => update(() => repositories.accountSettings.revokeDevice(id)),
    setMarketingEnabled: (enabled: boolean) => update(() => repositories.accountSettings.setMarketingEnabled(enabled)),
    requestDataExport: () => update(() => repositories.accountSettings.requestDataExport()),
    requestAccountDeletion: () => update(() => repositories.accountSettings.requestAccountDeletion()),
  };
}
