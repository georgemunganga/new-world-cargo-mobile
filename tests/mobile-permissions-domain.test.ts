import { describe, expect, it } from "vitest";
import { customerPermissions, permissionStatusLabel } from "../lib/domain/permission";

describe("mobile permission domain", () => {
  it("defines the required mobile permission education set", () => {
    expect(Object.keys(customerPermissions).sort()).toEqual(["biometrics", "camera", "contacts", "location", "notifications", "photos"]);
    expect(customerPermissions.location.manualAlternative).toContain("search");
  });

  it("uses customer-safe permission status labels", () => {
    expect(permissionStatusLabel("not_requested")).toBe("Not requested");
    expect(permissionStatusLabel("granted")).toBe("Allowed for preview");
    expect(permissionStatusLabel("denied")).toBe("Not allowed");
  });
});
