import { useQueryClient } from "@tanstack/react-query";
import { customerQueries } from "@/lib/data/customer-queries";
import { useCustomerQuery } from "@/lib/data/use-customer-query";
import { repositories } from "@/lib/repositories";
import { useState } from "react";
import type { CustomerProfile } from "@/lib/domain/customer";
import { customerSafeMessageFor } from "@/lib/api/errors";
export function useCustomerProfile() {
  const client = useQueryClient();
  const query = useCustomerQuery(customerQueries.profile);
  const [saving, setSaving] = useState(false),
    [error, setError] = useState("");
  const updateProfile = async (
    input: Partial<
      Pick<CustomerProfile, "name" | "phone" | "city" | "avatarUrl">
    >,
  ) => {
    setSaving(true);
    setError("");
    try {
      const profile = await repositories.customer.updateProfile(input);
      await client.cancelQueries({
        queryKey: customerQueries.profile.queryKey,
      });
      client.setQueryData(customerQueries.profile.queryKey, profile);
      return profile;
    } catch (e) {
      setError(customerSafeMessageFor(e));
      return null;
    } finally {
      setSaving(false);
    }
  };
  return {
    profile: query.data ?? null,
    status: saving ? ("loading" as const) : query.status,
    errorMessage: error || query.errorMessage,
    refresh: async () => (await query.refetch()).data ?? null,
    updateProfile,
  };
}
