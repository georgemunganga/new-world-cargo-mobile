import { apiClient } from "@/lib/api/client";
import type { OtpChallenge } from "@/lib/domain/auth";
import type { AuthRepository } from "@/lib/repositories/types";
import { mapPortalSession, portalPasswordResetPayload, portalRegisterPayload } from "./portal-auth-contract";
import type { PortalAuthUser, PortalEnvelope } from "./portal-auth-contract";

function otpChallengeFromPortalUser(user: PortalAuthUser, purpose: OtpChallenge["purpose"]): OtpChallenge {
  return {
    id: String(user.id),
    destination: user.phone || user.email || "your account",
    channel: user.phone ? "phone" : "email",
    purpose,
    resendAfterSeconds: 60,
  };
}

export const laravelAuthRepository: AuthRepository = {
  async signIn(input) {
    const response = await apiClient.post<PortalEnvelope<PortalAuthUser>>(
      "/api/v1/auth/login",
      { identifier: input.identifier, password: input.password },
      { auth: false },
    );
    return mapPortalSession(response);
  },
  async register(input) {
    const response = await apiClient.post<PortalEnvelope<PortalAuthUser>>("/api/v1/auth/register", portalRegisterPayload(input), { auth: false });
    return otpChallengeFromPortalUser(response.data, "register");
  },
  async verifyOtp(input) {
    await apiClient.post<PortalEnvelope<null>>("/api/v1/auth/verify", { code: input.code }, { auth: false });
    const session = await apiClient.get<PortalEnvelope<PortalAuthUser>>("/api/v1/session", { auth: false });
    return mapPortalSession(session);
  },
  async requestPasswordReset(input) {
    await apiClient.post<PortalEnvelope<null>>("/api/v1/auth/password/forgot", { email: input.identifier.trim().toLowerCase() }, { auth: false });
    return {
      id: input.identifier.trim().toLowerCase(),
      destination: input.identifier.trim().toLowerCase(),
      channel: "email",
      purpose: "password-reset",
      resendAfterSeconds: 60,
    };
  },
  async resetPassword(input) {
    await apiClient.post<PortalEnvelope<null>>("/api/v1/auth/password/reset", portalPasswordResetPayload(input), { auth: false });
  },
  async changePassword(input) {
    await apiClient.post<PortalEnvelope<null>>("/api/v1/auth/password/change", {
      currentPassword: input.currentPassword,
      nextPassword: input.newPassword,
    });
  },
  async resendOtp(challengeId) {
    await apiClient.post<PortalEnvelope<null>>("/api/v1/auth/verify/resend", {}, { auth: false });
    return {
      id: challengeId,
      destination: "your account",
      channel: "email",
      purpose: "register",
      resendAfterSeconds: 60,
    };
  },
  async restoreSession() {
    try {
      const response = await apiClient.get<PortalEnvelope<PortalAuthUser>>("/api/v1/session", { auth: false });
      return mapPortalSession(response);
    } catch {
      return null;
    }
  },
  async signOut() {
    await apiClient.post<void>("/api/v1/auth/logout");
  },
};
