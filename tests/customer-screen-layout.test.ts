import { describe, expect, it } from "vitest";
import { customerNoNavigationBottomInset, getCustomerContentBottomInset } from "../lib/customer-screen-layout";

describe("customer screen layout insets", () => {
  it("keeps no-navigation screens compact while preserving the system bottom inset", () => {
    expect(getCustomerContentBottomInset(0, false)).toBe(customerNoNavigationBottomInset);
    expect(getCustomerContentBottomInset(32, false)).toBe(32);
  });

  it("reserves the full floating navigation footprint for scrollable tab content", () => {
    expect(getCustomerContentBottomInset(0, true)).toBe(122);
    expect(getCustomerContentBottomInset(34, true)).toBe(140);
  });
});
