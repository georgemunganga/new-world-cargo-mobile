import type { AuthSession, PasswordResetInput, RegisterCustomerInput } from "@/lib/domain/auth";
import type { CustomerProfile } from "@/lib/domain/customer";

export type PortalEnvelope<T> = {
  data: T;
  meta?: {
    mobileSession?: {
      token?: string;
      csrfToken?: string;
      expiresAt?: string;
    };
    [key: string]: unknown;
  };
  requestId?: string;
};

export type PortalAuthUser = {
  id: number | string;
  firstName?: string | null;
  lastName?: string | null;
  email?: string | null;
  phone?: string | null;
  avatar?: string | null;
  provider?: "password" | "google" | string | null;
  verified?: boolean;
};

export function splitPortalName(name: string) {
  const [firstName = "", rest = ""] = name.trim().split(/\s+/, 2);
  return {
    firstName: firstName || name.trim() || "Customer",
    lastName: rest,
  };
}

export function portalRegisterPayload(input: RegisterCustomerInput) {
  const name = splitPortalName(input.name);
  return {
    firstName: name.firstName,
    lastName: name.lastName,
    email: input.email.trim().toLowerCase(),
    phone: input.phone.trim(),
    password: input.password,
  };
}

export function portalPasswordResetPayload(input: PasswordResetInput) {
  return {
    email: input.challengeId,
    token: input.code,
    password: input.password,
    password_confirmation: input.password,
  };
}

export function mapPortalCustomer(user: PortalAuthUser): CustomerProfile {
  const displayName = [user.firstName, user.lastName].filter(Boolean).join(" ").trim();
  return {
    id: String(user.id),
    name: displayName || user.email || "New WorldCargo customer",
    phone: user.phone || "",
    ...(user.email ? { email: user.email } : {}),
    city: "Lusaka",
    ...(user.avatar ? { avatarUrl: user.avatar } : {}),
    portalEnabled: true,
  };
}

export function mapPortalSession(response: PortalEnvelope<PortalAuthUser>): AuthSession {
  const mobileSession = response.meta?.mobileSession;
  return {
    ...(mobileSession?.token ? { token: mobileSession.token } : {}),
    ...(mobileSession?.csrfToken ? { csrfToken: mobileSession.csrfToken } : {}),
    ...(mobileSession?.expiresAt ? { expiresAt: mobileSession.expiresAt } : {}),
    customer: mapPortalCustomer(response.data),
  };
}
