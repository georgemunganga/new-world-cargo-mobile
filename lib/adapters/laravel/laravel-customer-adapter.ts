import { apiClient } from "@/lib/api/client";
import type { CustomerProfile } from "@/lib/domain/customer";
import type { CustomerRepository } from "@/lib/repositories/types";
import { mapPortalCustomer, splitPortalName } from "./portal-auth-contract";
import type { PortalAuthUser, PortalEnvelope } from "./portal-auth-contract";

export const laravelCustomerRepository: CustomerRepository = {
  async getProfile() {
    const response = await apiClient.get<PortalEnvelope<PortalAuthUser>>("/api/v1/profile");
    return mapPortalCustomer(response.data);
  },
  async updateProfile(input) {
    const payload: Record<string, string | null> = {};
    if (input.name !== undefined) {
      const name = splitPortalName(input.name);
      payload.firstName = name.firstName;
      payload.lastName = name.lastName;
    }
    if (input.phone !== undefined) payload.phone = input.phone;
    if ("avatarUrl" in input) payload.avatarFileId = input.avatarUrl || null;
    const response = await apiClient.patch<PortalEnvelope<PortalAuthUser>>("/api/v1/profile", payload);
    return mapPortalCustomer(response.data);
  },
};
