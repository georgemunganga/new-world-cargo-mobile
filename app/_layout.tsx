import { Stack } from "expo-router";
import { Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, useFonts } from "@expo-google-fonts/poppins";
import { StatusBar } from "expo-status-bar";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { BookingDraftProvider } from "@/stores/booking-draft";
import { CustomerAuthProvider } from "@/stores/customer-auth";
import { AppStartupProvider } from "@/stores/app-startup";
import { MockPermissionProvider } from "@/stores/mock-permissions";
import { MockBillingProvider } from "@/stores/mock-billing";
import { NotificationPreferenceProvider } from "@/stores/notification-preferences";

const nativePoppinsFonts = { Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold };
const browserSafeFonts = Platform.OS === "web" ? {} : nativePoppinsFonts;

export default function RootLayout() {
  useFonts(browserSafeFonts);
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><ThemeProvider><AppStartupProvider><CustomerAuthProvider><MockPermissionProvider><MockBillingProvider><NotificationPreferenceProvider><BookingDraftProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, animation: "fade" }} /></BookingDraftProvider></NotificationPreferenceProvider></MockBillingProvider></MockPermissionProvider></CustomerAuthProvider></AppStartupProvider></ThemeProvider></SafeAreaProvider></GestureHandlerRootView>;
}
