import { describe, expect, it } from "vitest";
import {
  mapPortalCustomer,
  mapPortalSession,
  portalPasswordResetPayload,
  portalRegisterPayload,
  splitPortalName,
} from "../lib/adapters/laravel/portal-auth-contract";

describe("mobile Laravel auth contract", () => {
  it("maps the CustomerPortalApi auth envelope into the mobile session model", () => {
    const session = mapPortalSession({
      data: {
        id: "1",
        firstName: "George",
        lastName: "Munganga",
        email: "george@example.com",
        phone: "+260971234567",
        avatar: "/storage/avatars/george.png",
        provider: "password",
        verified: true,
      },
      meta: {
        mobileSession: {
          token: "mobile-token",
          csrfToken: "mobile-csrf",
          expiresAt: "2026-10-14T00:00:00Z",
        },
      },
      requestId: "request-1",
    });

    expect(session).toMatchObject({
      token: "mobile-token",
      csrfToken: "mobile-csrf",
      expiresAt: "2026-10-14T00:00:00Z",
      customer: {
        id: "1",
        name: "George Munganga",
        email: "george@example.com",
        phone: "+260971234567",
        city: "Lusaka",
        avatarUrl: "/storage/avatars/george.png",
        portalEnabled: true,
      },
    });
  });

  it("builds Laravel register payloads from the mobile domain input", () => {
    expect(portalRegisterPayload({
      name: "Thelma Sunyanga",
      email: "THELMA@EXAMPLE.COM",
      phone: "+260 97 000 0000",
      city: "Lusaka",
      password: "JesusisLord#202!",
    })).toEqual({
      firstName: "Thelma",
      lastName: "Sunyanga",
      email: "thelma@example.com",
      phone: "+260 97 000 0000",
      password: "JesusisLord#202!",
    });
  });

  it("keeps profile names compatible with Laravel firstName and lastName fields", () => {
    expect(splitPortalName("IT Department")).toEqual({ firstName: "IT", lastName: "Department" });
    expect(mapPortalCustomer({ id: 7, firstName: "IT", lastName: null, email: "it@example.com" }).name).toBe("IT");
  });

  it("documents the current Laravel password reset token shape", () => {
    expect(portalPasswordResetPayload({
      challengeId: "george@example.com",
      code: "reset-token-from-email",
      password: "JesusisLord#202!",
    })).toEqual({
      email: "george@example.com",
      token: "reset-token-from-email",
      password: "JesusisLord#202!",
      password_confirmation: "JesusisLord#202!",
    });
  });
});
