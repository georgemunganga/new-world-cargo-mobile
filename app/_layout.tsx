import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, useFonts } from "@expo-google-fonts/poppins";
import { StatusBar } from "expo-status-bar";
import { ActivityIndicator, Image, Platform, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { BookingDraftProvider } from "@/stores/booking-draft";
import { CustomerAuthProvider } from "@/stores/customer-auth";
import { AppStartupProvider } from "@/stores/app-startup";
import { MockPermissionProvider } from "@/stores/mock-permissions";
import { MockBillingProvider } from "@/stores/mock-billing";
import { NotificationPreferenceProvider } from "@/stores/notification-preferences";
import { MockAccountDirectoryProvider } from "@/stores/mock-account-directory";
import { MockSupportProvider } from "@/stores/mock-support";
import { MockPickupManagementProvider } from "@/stores/mock-pickup-management";
import { MockAccountSettingsProvider } from "@/stores/mock-account-settings";
import { MockReturnsProvider } from "@/stores/mock-returns";
import { shouldLoadBundledPoppins } from "@/lib/startup-font-policy";

const poppinsFonts = { Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold };

export default function RootLayout() {
  if (shouldLoadBundledPoppins(Platform.OS)) return <NativeFontRoot />;
  return <AppRoot />;
}

function NativeFontRoot() {
  // Native ships Poppins with the binary. It is intentionally never awaited, so startup remains responsive.
  useFonts(poppinsFonts);
  return <AppRoot />;
}

function AppRoot() {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><ThemeProvider><AppStartupProvider><CustomerAuthProvider><MockPermissionProvider><MockBillingProvider><MockAccountDirectoryProvider><MockSupportProvider><MockPickupManagementProvider><MockAccountSettingsProvider><MockReturnsProvider><NotificationPreferenceProvider><BookingDraftProvider><StatusBar style={showSplash ? "light" : "dark"} /><Stack screenOptions={{ headerShown: false, animation: "fade" }} /></BookingDraftProvider></NotificationPreferenceProvider></MockReturnsProvider></MockAccountSettingsProvider></MockPickupManagementProvider></MockSupportProvider></MockAccountDirectoryProvider></MockBillingProvider></MockPermissionProvider></CustomerAuthProvider></AppStartupProvider></ThemeProvider></SafeAreaProvider>{showSplash ? <LaunchSplash /> : null}</GestureHandlerRootView>;
}

function LaunchSplash() {
  return <View accessibilityLabel="New WorldCargo is loading" accessibilityRole="progressbar" style={styles.splash}><View style={styles.splashContent}><Image source={require("../assets/images/new-world-cargo-logo-light.png")} resizeMode="contain" style={styles.splashLogo} /><ActivityIndicator color="#FFC83D" size="small" style={styles.splashLoader} /></View></View>;
}

const styles = StyleSheet.create({
  splash: { ...StyleSheet.absoluteFillObject, zIndex: 1000, alignItems: "center", justifyContent: "center", backgroundColor: "#012642" },
  splashContent: { alignItems: "center", justifyContent: "center" },
  splashLogo: { width: 240, height: 96 },
  splashLoader: { marginTop: 24 },
});
