import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

const rawBundleId = process.env.EXPO_PUBLIC_APP_ID ?? "com.newworldcargo.mobile";
const bundleId = rawBundleId
  .replace(/[-_]/g, ".")
  .replace(/[^a-zA-Z0-9.]/g, "")
  .replace(/\.+/g, ".")
  .replace(/^\.+|\.+$/g, "")
  .toLowerCase();

const env = {
  appName: process.env.EXPO_PUBLIC_APP_NAME ?? "New WorldCargo",
  appSlug: process.env.EXPO_PUBLIC_APP_SLUG ?? "new-world-cargo-mobile",
  scheme: process.env.EXPO_PUBLIC_APP_SCHEME ?? "newworldcargo",
  iosBundleId: bundleId,
  androidPackage: bundleId,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription: "Allow New WorldCargo to scan shipment labels and attach cargo evidence.",
      NSPhotoLibraryUsageDescription: "Allow New WorldCargo to select profile photos and support evidence.",
      NSLocationWhenInUseUsageDescription: "Allow New WorldCargo to help choose pickup and delivery locations.",
    },
  },
  android: {
    adaptiveIcon: {
      backgroundColor: "#012642",
      foregroundImage: "./assets/images/android-icon-foreground.png",
    },
    edgeToEdgeEnabled: true,
    predictiveBackGestureEnabled: false,
    package: env.androidPackage,
    permissions: ["POST_NOTIFICATIONS", "CAMERA", "ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION"],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-secure-store",
      {
        configureAndroidBackup: true,
        faceIDPermission: "Allow $(PRODUCT_NAME) to securely access your New WorldCargo account.",
      },
    ],
    [
      "expo-splash-screen",
      {
        image: "./assets/images/new-world-cargo-logo-light.png",
        imageWidth: 240,
        resizeMode: "contain",
        backgroundColor: "#012642",
        dark: { backgroundColor: "#012642" },
      },
    ],
    [
      "expo-build-properties",
      { android: { buildArchs: ["armeabi-v7a", "arm64-v8a"], minSdkVersion: 24 } },
    ],
  ],
  experiments: { typedRoutes: true, reactCompiler: true },
};

export default config;
