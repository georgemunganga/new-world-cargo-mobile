import { describe, expect, it } from "vitest";
import { authEntryPath, decodeStoredCustomer } from "../lib/customer-session";

describe("customer session restore and protected entry", () => {
  const validSession = JSON.stringify({ id: "local-1", name: "Chanda Mwila", phone: "+260971234567", city: "Lusaka" });

  it("restores a valid local customer session", () => {
    expect(decodeStoredCustomer(validSession)).toEqual({ id: "local-1", name: "Chanda Mwila", phone: "+260971234567", city: "Lusaka" });
  });

  it("rejects malformed or incomplete sessions before protected entry", () => {
    expect(decodeStoredCustomer("not-json")).toBeNull();
    expect(decodeStoredCustomer(JSON.stringify({ id: "local-1", name: "Chanda" }))).toBeNull();
  });

  it("routes signed-out users to authentication and restored users to the customer tabs", () => {
    expect(authEntryPath(null)).toBe("/auth/welcome");
    expect(authEntryPath(decodeStoredCustomer(validSession))).toBe("/(tabs)");
  });
});
