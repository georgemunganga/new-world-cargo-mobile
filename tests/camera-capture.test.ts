import { beforeEach, describe, expect, it, vi } from "vitest";
import { Platform } from "react-native";
import * as picker from "expo-image-picker";
import { cameraService } from "../lib/services/device/camera-service";

vi.mock("expo-image-picker", () => ({
  requestCameraPermissionsAsync: vi.fn(),
  launchCameraAsync: vi.fn(),
}));
beforeEach(() => {
  vi.resetAllMocks();
  Platform.OS = "android";
});

describe("cargo camera capture", () => {
  it("returns a captured photo for the existing upload flow", async () => {
    vi.mocked(picker.requestCameraPermissionsAsync).mockResolvedValue({
      granted: true,
    } as never);
    vi.mocked(picker.launchCameraAsync).mockResolvedValue({
      canceled: false,
      assets: [
        {
          uri: "file:///cargo.jpg",
          fileName: "cargo.jpg",
          mimeType: "image/jpeg",
        },
      ],
    } as never);
    await expect(cameraService.capturePhoto()).resolves.toEqual({
      ok: true,
      value: {
        uri: "file:///cargo.jpg",
        name: "cargo.jpg",
        type: "image/jpeg",
      },
    });
  });
  it("does not launch the camera when permission is denied", async () => {
    vi.mocked(picker.requestCameraPermissionsAsync).mockResolvedValue({
      granted: false,
    } as never);
    await expect(cameraService.capturePhoto()).resolves.toMatchObject({
      ok: false,
      reason: "permission-denied",
    });
    expect(picker.launchCameraAsync).not.toHaveBeenCalled();
  });
  it("handles cancellation without attaching an image", async () => {
    vi.mocked(picker.requestCameraPermissionsAsync).mockResolvedValue({
      granted: true,
    } as never);
    vi.mocked(picker.launchCameraAsync).mockResolvedValue({
      canceled: true,
      assets: null,
    });
    await expect(cameraService.capturePhoto()).resolves.toMatchObject({
      ok: false,
      reason: "cancelled",
    });
  });
  it("handles camera failures without rejecting into the UI", async () => {
    vi.mocked(picker.requestCameraPermissionsAsync).mockRejectedValue(
      new Error("camera unavailable"),
    );
    await expect(cameraService.capturePhoto()).resolves.toMatchObject({
      ok: false,
      reason: "unknown",
    });
  });
});
