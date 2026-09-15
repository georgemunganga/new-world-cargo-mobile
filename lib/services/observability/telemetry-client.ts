import Constants from "expo-constants";
import { Platform } from "react-native";

import { mobileEnv } from "@/lib/config/env";
import type { RedactableProperties } from "./redaction";

export function sendTelemetry(event: string, properties: RedactableProperties) {
  if (!mobileEnv.apiBaseUrl) return;
  const safeProperties = Object.fromEntries(Object.entries(properties).filter(([key]) => !/token|password|secret|authorization|cookie|phone|email|address/i.test(key)));
  void fetch(`${mobileEnv.apiBaseUrl}/api/v1/telemetry/events`, {
    method: "POST",
    headers: { Accept: "application/json", "Content-Type": "application/json" },
    body: JSON.stringify({ event, appVersion: Constants.expoConfig?.version, platform: Platform.OS, properties: safeProperties }),
  }).catch(() => undefined);
}
