import { apiClient } from "@/lib/api/client";
import type { AuthRepository } from "@/lib/repositories/types";
import type { AuthSession } from "@/lib/domain/auth";

type LaravelAuthResponse = {
  token?: string;
  refresh_token?: string;
  expires_at?: string;
  user?: {
    id: number | string;
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    city?: string | null;
    avatar_url?: string | null;
    portal_enabled?: boolean;
    branch_id?: number | string | null;
  };
};

function mapSession(response: LaravelAuthResponse): AuthSession {
  const user = response.user;
  if (!user) throw new Error("Laravel auth response did not include a customer profile.");
  return {
    token: response.token,
    refreshToken: response.refresh_token,
    expiresAt: response.expires_at,
    customer: {
      id: String(user.id),
      name: user.name || "New WorldCargo customer",
      phone: user.phone || "",
      ...(user.email ? { email: user.email } : {}),
      city: user.city || "Lusaka",
      ...(user.avatar_url ? { avatarUrl: user.avatar_url } : {}),
      portalEnabled: user.portal_enabled !== false,
      ...(user.branch_id ? { branchId: String(user.branch_id) } : {}),
    },
  };
}

export const laravelAuthRepository: AuthRepository = {
  async signIn(input) {
    const response = await apiClient.post<LaravelAuthResponse>("/api/customer/auth/login", input, { auth: false });
    return mapSession(response);
  },
  async register(input) {
    return apiClient.post("/api/customer/auth/register", input, { auth: false });
  },
  async verifyOtp(input) {
    const response = await apiClient.post<LaravelAuthResponse>("/api/customer/auth/verify-otp", input, { auth: false });
    return mapSession(response);
  },
  async requestPasswordReset(input) {
    return apiClient.post("/api/customer/auth/password/request", input, { auth: false });
  },
  async resetPassword(input) {
    await apiClient.post("/api/customer/auth/password/reset", input, { auth: false });
  },
  async changePassword(input) {
    await apiClient.post("/api/customer/auth/password/change", {
      current_password: input.currentPassword,
      password: input.newPassword,
      password_confirmation: input.newPassword,
    });
  },
  async resendOtp(challengeId) {
    return apiClient.post("/api/customer/auth/otp/resend", { challengeId }, { auth: false });
  },
  async restoreSession() {
    const response = await apiClient.get<LaravelAuthResponse>("/api/customer/auth/me");
    return mapSession(response);
  },
  async signOut() {
    await apiClient.post("/api/customer/auth/logout");
  },
};
