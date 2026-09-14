import { describe, expect, it } from "vitest";
import fs from "node:fs";
import config from "../app.config";
import eas from "../eas.json";
import pkg from "../package.json";

describe("mobile release configuration", () => {
  it("uses New WorldCargo production-ready identifiers by default", () => {
    expect(config.name).toBe("New WorldCargo");
    expect(config.slug).toBe("new-world-cargo-mobile");
    expect(config.scheme).toBe("newworldcargo");
    expect(config.version).toBe("1.0.0");
    expect(config.runtimeVersion).toBe("1.0.0");
    expect(config.ios?.bundleIdentifier).toBe("com.newworldcargo.mobile");
    expect(config.ios?.buildNumber).toBe("1");
    expect(config.android?.package).toBe("com.newworldcargo.mobile");
    expect(config.android?.versionCode).toBe(1);
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
    expect(eas.build.staging.env.EXPO_PUBLIC_API_MODE).toBe("laravel");
    expect(eas.build.production.env.EXPO_PUBLIC_API_MODE).toBe("laravel");
    expect(eas.build.staging.env.EXPO_PUBLIC_MAPS_PROVIDER).toBe("native");
    expect(eas.build.staging.env.EXPO_PUBLIC_PAYMENTS_PROVIDER).toBe("laravel");
    expect(eas.build.production.env.EXPO_PUBLIC_MAPS_PROVIDER).toBe("native");
    expect(eas.build.production.env.EXPO_PUBLIC_PAYMENTS_PROVIDER).toBe("laravel");
  });

  it("exposes standard build and audit scripts", () => {
    expect(pkg.scripts.quality).toBe("node scripts/mobile-quality.mjs");
    expect(pkg.scripts["release:audit"]).toBe("node scripts/mobile-release-audit.mjs");
    expect(pkg.scripts["build:preview:android"]).toBe("eas build --profile preview --platform android");
    expect(pkg.scripts["build:staging:android"]).toBe("eas build --profile staging --platform android");
    expect(pkg.scripts["build:production:android"]).toBe("eas build --profile production --platform android");
    expect(pkg.scripts["build:production:ios"]).toBe("eas build --profile production --platform ios");
  });

  it("does not keep unused Expo template artwork in release assets", () => {
    expect(fs.existsSync("assets/images/react-logo.png")).toBe(false);
    expect(fs.existsSync("assets/images/react-logo@2x.png")).toBe(false);
    expect(fs.existsSync("assets/images/react-logo@3x.png")).toBe(false);
    expect(fs.existsSync("assets/images/partial-react-logo.png")).toBe(false);
    expect(fs.existsSync("assets/images/splash-icon.png")).toBe(false);
  });

  it("declares customer deep-link routes for native and web links", () => {
    expect(config.android?.intentFilters?.[0]).toMatchObject({
      action: "VIEW",
      autoVerify: true,
      category: ["BROWSABLE", "DEFAULT"],
      data: expect.arrayContaining([
        { scheme: "newworldcargo" },
        { scheme: "https", host: "app.newworldcargo.com" },
      ]),
    });
  });
});
