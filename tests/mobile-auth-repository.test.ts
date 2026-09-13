import { describe, expect, it } from "vitest";
import { FRONTEND_OTP_CODE } from "../lib/auth-flow";
import { mockAuthRepository } from "../lib/adapters/mock/mock-auth-adapter";

describe("mobile auth repository", () => {
  it("creates a registration challenge and verifies into a customer session", async () => {
    const challenge = await mockAuthRepository.register({
      name: "George Munganga",
      email: "George@Example.com",
      phone: "0971234567",
      city: "Lusaka",
      password: "JesusisLord#202!",
    });

    const session = await mockAuthRepository.verifyOtp({ challengeId: challenge.id, code: FRONTEND_OTP_CODE });

    expect(challenge.purpose).toBe("register");
    expect(session.customer).toMatchObject({
      name: "George Munganga",
      email: "george@example.com",
      phone: "+260971234567",
      city: "Lusaka",
      portalEnabled: true,
    });
  });

  it("supports password reset challenge and rejects an invalid OTP", async () => {
    const challenge = await mockAuthRepository.requestPasswordReset({ identifier: "george@example.com" });

    await expect(mockAuthRepository.resetPassword({ challengeId: challenge.id, code: "000000", password: "new-password" })).rejects.toThrow("incorrect");
    await expect(mockAuthRepository.resetPassword({ challengeId: challenge.id, code: FRONTEND_OTP_CODE, password: "new-password" })).resolves.toBeUndefined();
  });

  it("validates signed-in password changes through the same auth boundary", async () => {
    await expect(mockAuthRepository.changePassword({ currentPassword: "short", newPassword: "JesusisLord#202!" })).rejects.toThrow("current password");
    await expect(mockAuthRepository.changePassword({ currentPassword: "JesusisKing#202!", newPassword: "new" })).rejects.toThrow("at least 8");
    await expect(mockAuthRepository.changePassword({ currentPassword: "JesusisKing#202!", newPassword: "JesusisLord#202!" })).resolves.toBeUndefined();
  });
});
