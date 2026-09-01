import { describe, expect, it, vi } from "vitest";

import { copyTrackingNumber, shareTrackingNumber } from "../lib/customer-tracking-actions";

describe("customer tracking actions", () => {
  it("copies a tracking number through the browser clipboard", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await expect(copyTrackingNumber("NWC-784512")).resolves.toMatchObject({ status: "copied" });
    expect(writeText).toHaveBeenCalledWith("NWC-784512");
    vi.unstubAllGlobals();
  });

  it("falls back to clipboard when browser sharing is unavailable", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    vi.stubGlobal("navigator", { clipboard: { writeText } });
    await expect(shareTrackingNumber("NWC-784512")).resolves.toMatchObject({ status: "copied" });
    vi.unstubAllGlobals();
  });
});
