import { useCallback, useEffect, useState } from "react";
import { customerSafeMessageFor } from "@/lib/api/errors";
import type { CustomerProfile } from "@/lib/domain/customer";
import { repositories } from "@/lib/repositories";

export function useCustomerProfile() {
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const refresh = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const nextProfile = await repositories.customer.getProfile();
      setProfile(nextProfile);
      setStatus("success");
      return nextProfile;
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
      return null;
    }
  }, []);

  const updateProfile = useCallback(async (input: Partial<Pick<CustomerProfile, "name" | "phone" | "city" | "avatarUrl">>) => {
    setStatus("loading");
    setErrorMessage("");
    try {
      const nextProfile = await repositories.customer.updateProfile(input);
      setProfile(nextProfile);
      setStatus("success");
      return nextProfile;
    } catch (error) {
      setErrorMessage(customerSafeMessageFor(error));
      setStatus("error");
      return null;
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return { profile, status, errorMessage, refresh, updateProfile };
}
