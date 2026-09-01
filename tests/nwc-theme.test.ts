import { describe, expect, it } from "vitest";
import { nwcColors } from "../lib/nwc-theme";

describe("New WorldCargo white-first surface system", () => {
  it("keeps the application canvas white while cards supply restrained contrast", () => {
    expect(nwcColors.background).toBe("#FFFFFF");
    expect(nwcColors.surface).toBe("#F5F7F7");
    expect(nwcColors.surfaceElevated).toBe("#FFFFFF");
  });

  it("reserves accent surface tokens for deliberate priority and selected states", () => {
    expect(nwcColors.surfaceAccent).toBe("#FFF7E2");
    expect(nwcColors.surfaceNavyTint).toBe("#EDF4F7");
    expect(nwcColors.primary).toBe("#FFC83D");
  });
});
