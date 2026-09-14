import "./scripts/load-env.js";
import type { ExpoConfig } from "expo/config";

const rawBundleId = process.env.EXPO_PUBLIC_APP_ID ?? "com.newworldcargo.mobile";
const googleMapsApiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY ?? "";
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
  version: process.env.EXPO_PUBLIC_APP_VERSION ?? "1.0.0",
  runtimeVersion: process.env.EXPO_PUBLIC_RUNTIME_VERSION ?? "1.0.0",
  iosBuildNumber: process.env.EXPO_PUBLIC_IOS_BUILD_NUMBER ?? "1",
  androidVersionCode: Number(process.env.EXPO_PUBLIC_ANDROID_VERSION_CODE ?? "1"),
  iosBundleId: bundleId,
  androidPackage: bundleId,
  expoProjectId: process.env.EXPO_PUBLIC_EXPO_PROJECT_ID,
};

const config: ExpoConfig = {
  name: env.appName,
  slug: env.appSlug,
  version: env.version,
  runtimeVersion: env.runtimeVersion,
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: env.scheme,
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: env.iosBundleId,
    buildNumber: env.iosBuildNumber,
    config: googleMapsApiKey ? { googleMapsApiKey } : undefined,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription: "Allow New WorldCargo to scan shipment labels and attach cargo evidence.",
      NSPhotoLibraryUsageDescription: "Allow New WorldCargo to select profile photos and support evidence.",
      NSLocationWhenInUseUsageDescription: "Allow New WorldCargo to help choose pickup and delivery locations.",
      NSContactsUsageDescription: "Allow New WorldCargo to fill delivery contact details from your phone contacts.",
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
    versionCode: Number.isFinite(env.androidVersionCode) && env.androidVersionCode > 0 ? env.androidVersionCode : 1,
    config: googleMapsApiKey ? { googleMaps: { apiKey: googleMapsApiKey } } : undefined,
    permissions: ["POST_NOTIFICATIONS", "CAMERA", "ACCESS_FINE_LOCATION", "ACCESS_COARSE_LOCATION", "READ_CONTACTS"],
    intentFilters: [
      {
        action: "VIEW",
        autoVerify: true,
        data: [
          { scheme: env.scheme },
          { scheme: "https", host: "app.newworldcargo.com" },
        ],
        category: ["BROWSABLE", "DEFAULT"],
      },
    ],
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  extra: {
    eas: env.expoProjectId ? { projectId: env.expoProjectId } : undefined,
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
