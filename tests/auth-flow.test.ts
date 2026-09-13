import { describe, expect, it } from "vitest";
import { firstName, isValidFrontendOtp, isValidPhoneInput, normaliseZambianPhone } from "../lib/auth-flow";

describe("New WorldCargo frontend authentication", () => {
  it("normalises standard Zambian mobile number formats", () => {
    expect(normaliseZambianPhone("0971 234 567")).toBe("+260971234567");
    expect(normaliseZambianPhone("260971234567")).toBe("+260971234567");
  });

  it("accepts an eleven-digit local mobile entry after normalisation", () => {
    expect(isValidPhoneInput("0971 234 567")).toBe(true);
    expect(isValidPhoneInput("97123")).toBe(false);
  });

  it("accepts real six-digit verification codes from the backend", () => {
    expect(isValidFrontendOtp("123456")).toBe(true);
    expect(isValidFrontendOtp("123455")).toBe(true);
    expect(isValidFrontendOtp("12345")).toBe(false);
    expect(isValidFrontendOtp("ABC123")).toBe(false);
  });

  it("uses a safe first name for the authenticated Home greeting", () => {
    expect(firstName("Chanda Mwila")).toBe("Chanda");
    expect(firstName(" ")).toBe("there");
  });
});
