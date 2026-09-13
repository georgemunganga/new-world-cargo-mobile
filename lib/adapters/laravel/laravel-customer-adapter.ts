import { apiClient } from "@/lib/api/client";
import type { CustomerProfile } from "@/lib/domain/customer";
import type { CustomerRepository } from "@/lib/repositories/types";

export const laravelCustomerRepository: CustomerRepository = {
  async getProfile() {
    const response = await apiClient.get<{ data: CustomerProfile }>("/api/customer/profile");
    return response.data;
  },
  async updateProfile(input) {
    const response = await apiClient.patch<{ data: CustomerProfile }>("/api/customer/profile", input);
    return response.data;
  },
};
