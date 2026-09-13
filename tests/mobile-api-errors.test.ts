import { afterEach, describe, expect, it, vi } from "vitest";
import { createApiClient } from "../lib/api/client";
import { MobileApiError, apiCodeFromServer, apiCodeFromStatus, customerSafeMessageFor } from "../lib/api/errors";
import { addSessionExpiredListener } from "../lib/api/session-events";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("mobile API errors", () => {
  it("maps Laravel-style HTTP statuses into mobile error codes", () => {
    expect(apiCodeFromStatus(401)).toBe("UNAUTHENTICATED");
    expect(apiCodeFromStatus(403)).toBe("FORBIDDEN");
    expect(apiCodeFromStatus(422)).toBe("VALIDATION_FAILED");
    expect(apiCodeFromStatus(500)).toBe("SERVER_ERROR");
  });

  it("preserves Laravel portal API error codes that carry product meaning", () => {
    expect(apiCodeFromServer("CONTACT_UNVERIFIED")).toBe("CONTACT_UNVERIFIED");
    expect(apiCodeFromServer("CURRENT_PASSWORD_INVALID")).toBe("CURRENT_PASSWORD_INVALID");
    expect(apiCodeFromServer("SOMETHING_NEW")).toBeNull();
  });

  it("keeps customer-safe messages available for UI states", () => {
    expect(customerSafeMessageFor(new MobileApiError("NETWORK_UNAVAILABLE", "Check your connection."))).toBe("Check your connection.");
    expect(customerSafeMessageFor("unknown")).toBe("Something went wrong. Please try again.");
  });

  it("notifies the auth store when an authenticated request has expired", async () => {
    const expired = vi.fn();
    const remove = addSessionExpiredListener(expired);
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error: { code: "UNAUTHENTICATED", message: "Please sign in again." } }), { status: 401, headers: { "content-type": "application/json" } })));

    await expect(createApiClient({ baseUrl: "https://api.example.test", getAuthToken: async () => "token" }).get("/api/v1/shipments")).rejects.toMatchObject({ code: "UNAUTHENTICATED" });

    expect(expired).toHaveBeenCalledTimes(1);
    remove();
  });

  it("does not notify session expiry for public auth-free requests", async () => {
    const expired = vi.fn();
    const remove = addSessionExpiredListener(expired);
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ error: { code: "UNAUTHENTICATED", message: "Not signed in." } }), { status: 401, headers: { "content-type": "application/json" } })));

    await expect(createApiClient({ baseUrl: "https://api.example.test" }).get("/api/v1/session", { auth: false })).rejects.toMatchObject({ code: "UNAUTHENTICATED" });

    expect(expired).not.toHaveBeenCalled();
    remove();
  });
});
