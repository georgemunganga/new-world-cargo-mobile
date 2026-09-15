import { useQueryClient } from "@tanstack/react-query";
import { customerQueries } from "@/lib/data/customer-queries";
import { useCustomerQuery } from "@/lib/data/use-customer-query";
import { useCallback, useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { AccountSettingsSnapshot } from "@/lib/domain/account-settings";
import { repositories } from "@/lib/repositories";

const emptySettings: AccountSettingsSnapshot = { devices: [], marketingEnabled: false, dataExportRequested: false, deletionRequested: false };

export function useAccountSettings() {
  const query = useCustomerQuery(customerQueries.settings);
  const client = useQueryClient();
  const settings = query.data ?? emptySettings;
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const status = saving ? "updating" as const : query.status;
  const refresh = query.refresh;
  const update = useCallback(async (action: () => Promise<AccountSettingsSnapshot>) => {
    setSaving(true);
    setErrorMessage("");
    try {
      const next = await action();
      await client.cancelQueries({queryKey: customerQueries.settings.queryKey});
      client.setQueryData(customerQueries.settings.queryKey, next);
      setSaving(false);
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setSaving(false);
    }
  }, [client]);

  return {
    ...settings,
    status,
    errorMessage: errorMessage || query.errorMessage,
    refresh,
    revokeDevice: (id: string) => update(() => repositories.accountSettings.revokeDevice(id)),
    setMarketingEnabled: (enabled: boolean) => update(() => repositories.accountSettings.setMarketingEnabled(enabled)),
    requestDataExport: () => update(() => repositories.accountSettings.requestDataExport()),
    requestAccountDeletion: () => update(() => repositories.accountSettings.requestAccountDeletion()),
  };
}
