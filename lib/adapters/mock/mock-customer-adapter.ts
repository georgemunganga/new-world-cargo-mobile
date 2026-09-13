import type { CustomerProfile } from "@/lib/domain/customer";
import type { CustomerRepository } from "@/lib/repositories/types";
import { readSecureSession, writeSecureSession } from "@/lib/storage/secure-session-storage";

const fallbackCustomer: CustomerProfile = {
  id: "mock-customer",
  name: "New WorldCargo customer",
  phone: "+260971234567",
  city: "Lusaka",
  portalEnabled: true,
};

export const mockCustomerRepository: CustomerRepository = {
  async getProfile() {
    return (await readSecureSession())?.customer ?? fallbackCustomer;
  },
  async updateProfile(input) {
    const current = await this.getProfile();
    const customer = { ...current, ...input };
    const session = await readSecureSession();
    if (session) await writeSecureSession({ ...session, customer });
    return customer;
  },
};
