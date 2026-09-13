import { MobileApiError } from "@/lib/api/errors";

export function missingPortalContract(feature: string): never {
  throw new MobileApiError("CONTRACT_MISSING", `${feature} needs a Laravel CustomerPortalApi contract before it can run live.`, {
    retryable: false,
  });
}
