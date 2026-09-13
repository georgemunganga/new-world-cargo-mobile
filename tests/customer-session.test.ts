import { describe, expect, it } from "vitest";
import { authEntryPath, decodeStoredCustomer } from "../lib/customer-session";

describe("customer session restore and protected entry", () => {
  const validSession = JSON.stringify({ id: "local-1", name: "Chanda Mwila", phone: "+260971234567", city: "Lusaka" });

  it("restores a valid local customer session", () => {
    expect(decodeStoredCustomer(validSession)).toEqual({ id: "local-1", name: "Chanda Mwila", phone: "+260971234567", city: "Lusaka" });
  });

  it("preserves optional API-backed customer metadata used by mobile screens", () => {
    const saved = decodeStoredCustomer(JSON.stringify({
      id: "customer-9",
      name: "George Munganga",
      phone: "+260971234567",
      email: "george@example.com",
      city: "Lusaka",
      avatarUrl: "https://cdn.example.test/avatar.jpg",
      branchId: "lusaka",
      portalEnabled: true,
    }));

    expect(saved).toMatchObject({
      email: "george@example.com",
      avatarUrl: "https://cdn.example.test/avatar.jpg",
      branchId: "lusaka",
      portalEnabled: true,
    });
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
