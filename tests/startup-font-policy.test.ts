import { describe, expect, it } from "vitest";
import { shouldLoadBundledPoppins } from "../lib/startup-font-policy";

describe("startup font policy", () => {
  it("never loads Expo font assets during browser startup", () => {
    expect(shouldLoadBundledPoppins("web")).toBe(false);
  });

  it("keeps bundled Poppins for native customer builds", () => {
    expect(shouldLoadBundledPoppins("ios")).toBe(true);
    expect(shouldLoadBundledPoppins("android")).toBe(true);
  });
});
