import { describe, expect, it } from "vitest";

import { cameraService } from "../lib/services/device/camera-service";
import { fileService, safeDownloadFilename } from "../lib/services/device/file-service";
import { locationService } from "../lib/services/device/location-service";
import { mapService } from "../lib/services/device/map-service";
import { nativeSuccess, nativeUnavailable } from "../lib/services/device/native-service-result";
import { shareService } from "../lib/services/device/share-service";

describe("mobile native-service adapter contracts", () => {
  it("returns structured unavailable results for device features not installed in the browser-safe build", async () => {
    await expect(cameraService.capturePhoto()).resolves.toMatchObject({ ok: false, reason: "browser-preview" });
    await expect(cameraService.pickImage()).resolves.toMatchObject({ ok: false, reason: "browser-preview" });
    await expect(fileService.pickDocument()).resolves.toMatchObject({ ok: false, reason: "browser-preview" });
    await expect(locationService.getCurrentLocation()).resolves.toMatchObject({ ok: false, reason: "browser-preview" });
  });

  it("keeps success and unavailable result helpers predictable", () => {
    expect(nativeSuccess({ id: "scan-1" })).toEqual({ ok: true, value: { id: "scan-1" } });
    expect(nativeUnavailable("browser-preview", "Not available here.")).toEqual({ ok: false, reason: "browser-preview", message: "Not available here." });
  });

  it("sanitizes filenames before browser-safe saving", () => {
    expect(safeDownloadFilename(" Receipt INV/1001 ?.html ")).toBe("Receipt-INV-1001-.html");
    expect(safeDownloadFilename("   ")).toBe("new-world-cargo-document.txt");
  });

  it("uses a mock map provider until a native map provider is connected", async () => {
    await expect(mapService.previewRoute(
      { label: "Lusaka", latitude: -15.3875, longitude: 28.3228 },
      { label: "Kitwe", latitude: -12.8024, longitude: 28.2132 },
    )).resolves.toMatchObject({ ok: true, value: { provider: "mock", service: "local", distanceLabel: "Local distance pending map provider" } });
  });

  it("returns a customer-safe unavailable result when native sharing is unavailable", async () => {
    await expect(shareService.shareDocument({ title: "Tracking", filename: "tracking.txt", text: "NWC-1" })).resolves.toMatchObject({ ok: false, reason: "browser-preview" });
  });
});
