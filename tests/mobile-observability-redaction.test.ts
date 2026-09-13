import { describe, expect, it } from "vitest";
import { redactSensitiveProperties, redactSensitiveText } from "../lib/services/observability/redaction";

describe("mobile observability redaction", () => {
  it("redacts sensitive values inside messages", () => {
    expect(redactSensitiveText("Bearer abc.def.ghi for george@example.com and +260 977 123 456")).toBe("Bearer [redacted] for [redacted-email] and [redacted-phone]");
  });

  it("redacts sensitive property keys and masks sensitive text values", () => {
    expect(redactSensitiveProperties({
      workflow: "login",
      token: "secret-token",
      customerEmail: "george@example.com",
      message: "Call +260 977 123 456",
    })).toEqual({
      workflow: "login",
      token: "[redacted]",
      customerEmail: "[redacted]",
      message: "Call [redacted-phone]",
    });
  });
});
