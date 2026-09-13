import { FRONTEND_OTP_CODE, isValidEmailInput, normaliseAuthIdentifier, normaliseZambianPhone } from "@/lib/auth-flow";
import type { AuthSession, OtpChallenge, OtpPurpose, RegisterCustomerInput } from "@/lib/domain/auth";
import type { AuthRepository } from "@/lib/repositories/types";

const challengeProfile = new Map<string, RegisterCustomerInput>();
const challengePurpose = new Map<string, OtpPurpose>();

function makeChallenge(destination: string, channel: "email" | "phone", purpose: OtpPurpose): OtpChallenge {
  const id = `mock-challenge-${Date.now()}`;
  challengePurpose.set(id, purpose);
  return { id, destination, channel, purpose, resendAfterSeconds: 30, expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString() };
}

function mockSessionFromIdentifier(identifier: string): AuthSession {
  const normalized = normaliseAuthIdentifier(identifier);
  const isEmail = isValidEmailInput(normalized);
  return {
    token: `mock-session-${Date.now()}`,
    customer: {
      id: `mock-customer-${Date.now()}`,
      name: "New WorldCargo customer",
      phone: isEmail ? "+260971234567" : normalized,
      ...(isEmail ? { email: normalized } : {}),
      city: "Lusaka",
      portalEnabled: true,
    },
  };
}

export const mockAuthRepository: AuthRepository = {
  async signIn(input) {
    return mockSessionFromIdentifier(input.identifier);
  },
  async register(input) {
    const challenge = makeChallenge(normaliseZambianPhone(input.phone), "phone", "register");
    challengeProfile.set(challenge.id, input);
    return challenge;
  },
  async verifyOtp(input) {
    if (input.code !== FRONTEND_OTP_CODE) throw new Error("That code is incorrect. Check it and try again.");
    const profile = challengeProfile.get(input.challengeId);
    if (profile) {
      return {
        token: `mock-session-${Date.now()}`,
        customer: {
          id: `mock-customer-${Date.now()}`,
          name: profile.name.trim(),
          email: profile.email.trim().toLowerCase(),
          phone: normaliseZambianPhone(profile.phone),
          city: profile.city.trim() || "Lusaka",
          portalEnabled: true,
        },
      };
    }
    return mockSessionFromIdentifier("+260971234567");
  },
  async requestPasswordReset(input) {
    const normalized = normaliseAuthIdentifier(input.identifier);
    return makeChallenge(normalized, isValidEmailInput(normalized) ? "email" : "phone", "password-reset");
  },
  async resetPassword(input) {
    if (input.code !== FRONTEND_OTP_CODE) throw new Error("That code is incorrect. Check it and try again.");
  },
  async changePassword(input) {
    if (input.currentPassword.length < 6) throw new Error("Enter your current password before changing it.");
    if (input.newPassword.length < 8) throw new Error("Use at least 8 characters for your new password.");
  },
  async resendOtp(challengeId) {
    const purpose = challengePurpose.get(challengeId) ?? "sign-in";
    return makeChallenge("+260971234567", "phone", purpose);
  },
  async restoreSession() {
    return null;
  },
  async signOut() {},
};
