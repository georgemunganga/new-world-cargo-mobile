import { describe, expect, it } from "vitest";
import { drawerHeightForSnap, nextCustomerDrawerSnap } from "../lib/customer-drawer";

describe("customer bottom drawer state", () => {
  it("snaps between half and expanded based on a meaningful vertical drag", () => {
    expect(nextCustomerDrawerSnap("half", -80)).toBe("expanded");
    expect(nextCustomerDrawerSnap("expanded", 60)).toBe("half");
    expect(nextCustomerDrawerSnap("half", 119)).toBe("dismissed");
  });

  it("keeps the expanded drawer clear of the top safe area", () => {
    expect(drawerHeightForSnap(800, 48, "half")).toBe(448);
    expect(drawerHeightForSnap(800, 48, "expanded")).toBe(740);
  });
});
