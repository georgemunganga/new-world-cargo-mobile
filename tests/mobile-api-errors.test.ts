import { describe, expect, it } from "vitest";
import { MobileApiError, apiCodeFromServer, apiCodeFromStatus, customerSafeMessageFor } from "../lib/api/errors";

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
});
