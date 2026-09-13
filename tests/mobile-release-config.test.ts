import { describe, expect, it } from "vitest";
import config from "../app.config";
import eas from "../eas.json";

describe("mobile release configuration", () => {
  it("uses New WorldCargo production-ready identifiers by default", () => {
    expect(config.name).toBe("New WorldCargo");
    expect(config.slug).toBe("new-world-cargo-mobile");
    expect(config.scheme).toBe("newworldcargo");
    expect(config.ios?.bundleIdentifier).toBe("com.newworldcargo.mobile");
    expect(config.android?.package).toBe("com.newworldcargo.mobile");
  });

  it("declares native permission copy for production app review", () => {
    expect(config.ios?.infoPlist).toMatchObject({
      NSCameraUsageDescription: expect.stringContaining("scan shipment labels"),
      NSPhotoLibraryUsageDescription: expect.stringContaining("profile photos"),
      NSLocationWhenInUseUsageDescription: expect.stringContaining("pickup and delivery"),
    });
    expect(config.android?.permissions).toEqual(expect.arrayContaining(["POST_NOTIFICATIONS", "CAMERA", "ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"]));
  });

  it("keeps build profiles separated by API mode", () => {
    expect(eas.build.preview.env.EXPO_PUBLIC_API_MODE).toBe("mock");
    expect(eas.build.staging.env.EXPO_PUBLIC_API_MODE).toBe("hybrid");
    expect(eas.build.production.env.EXPO_PUBLIC_API_MODE).toBe("laravel");
  });
});
