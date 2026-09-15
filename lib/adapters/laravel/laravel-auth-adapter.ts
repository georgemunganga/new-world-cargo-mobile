import { apiClient } from "@/lib/api/client";
import { getSessionToken } from "@/lib/_core/auth";
import { MobileApiError } from "@/lib/api/errors";
import type { OtpChallenge } from "@/lib/domain/auth";
import type { AuthRepository } from "@/lib/repositories/types";
import {
  mapPortalLoginSession,
  mapPortalSession,
  portalPasswordResetPayload,
  portalRegisterPayload,
} from "./portal-auth-contract";
import type { PortalAuthUser, PortalEnvelope } from "./portal-auth-contract";

function otpChallengeFromPortalUser(
  response: PortalEnvelope<PortalAuthUser>,
  purpose: OtpChallenge["purpose"],
): OtpChallenge {
  const user = response.data;
  const mobileSession = response.meta?.mobileSession;
  return {
    id: String(user.id),
    destination: user.phone || user.email || "your account",
    channel: user.phone ? "phone" : "email",
    purpose,
    resendAfterSeconds: 60,
    ...(mobileSession?.token ? { sessionToken: mobileSession.token } : {}),
    ...(mobileSession?.csrfToken ? { csrfToken: mobileSession.csrfToken } : {}),
    ...(mobileSession?.expiresAt
      ? { sessionExpiresAt: mobileSession.expiresAt }
      : {}),
  };
}

export const laravelAuthRepository: AuthRepository = {
  async signIn(input) {
    const response = await apiClient.post<PortalEnvelope<PortalAuthUser>>(
      "/api/v1/auth/login",
      { identifier: input.identifier, password: input.password },
      { auth: false },
    );
    return mapPortalLoginSession(response);
  },
  async register(input) {
    const response = await apiClient.post<PortalEnvelope<PortalAuthUser>>(
      "/api/v1/auth/register",
      portalRegisterPayload(input),
      { auth: false },
    );
    return otpChallengeFromPortalUser(response, "register");
  },
  async verifyOtp(input) {
    await apiClient.post<PortalEnvelope<null>>("/api/v1/auth/verify", {
      code: input.code,
    });
    const session =
      await apiClient.get<PortalEnvelope<PortalAuthUser>>("/api/v1/session");
    return mapPortalSession(session);
  },
  async requestPasswordReset(input) {
    await apiClient.post<PortalEnvelope<null>>(
      "/api/v1/auth/password/forgot",
      { identifier: input.identifier.trim().toLowerCase() },
      { auth: false },
    );
    return {
      id: input.identifier.trim().toLowerCase(),
      destination: input.identifier.trim().toLowerCase(),
      channel: "email",
      purpose: "password-reset",
      resendAfterSeconds: 60,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    };
  },
  async resetPassword(input) {
    await apiClient.post<PortalEnvelope<null>>(
      "/api/v1/auth/password/reset",
      portalPasswordResetPayload(input),
      { auth: false },
    );
  },
  async changePassword(input) {
    await apiClient.post<PortalEnvelope<null>>("/api/v1/auth/password/change", {
      currentPassword: input.currentPassword,
      nextPassword: input.newPassword,
    });
  },
  async resendOtp(challengeId) {
    await apiClient.post<PortalEnvelope<null>>(
      "/api/v1/auth/verify/resend",
      {},
    );
    return {
      id: challengeId,
      destination: "your account",
      channel: "email",
      purpose: "register",
      resendAfterSeconds: 60,
    };
  },
  async restoreSession() {
    // Native app startup must be authenticated by the token stored by the
    // mobile client. Do not let a persisted browser/Expo cookie restore a
    // customer before the login screen is shown.
    if (!(await getSessionToken())) return null;
    try {
      const response =
        await apiClient.get<PortalEnvelope<PortalAuthUser>>("/api/v1/session");
      return mapPortalSession(response);
    } catch (error) {
      if (error instanceof MobileApiError && error.code === "UNAUTHENTICATED")
        return null;
      throw error;
    }
  },
  async signOut() {
    await apiClient.post<void>("/api/v1/auth/logout");
  },
};
