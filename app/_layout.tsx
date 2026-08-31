import { Stack } from "expo-router";
import { Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold, useFonts } from "@expo-google-fonts/poppins";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider } from "@/lib/theme-provider";
import { BookingDraftProvider } from "@/stores/booking-draft";
import { CustomerAuthProvider } from "@/stores/customer-auth";
import { AppStartupProvider } from "@/stores/app-startup";

export default function RootLayout() {
  useFonts({ Poppins_500Medium, Poppins_600SemiBold, Poppins_700Bold, Poppins_800ExtraBold });
  return <GestureHandlerRootView style={{ flex: 1 }}><SafeAreaProvider><ThemeProvider><AppStartupProvider><CustomerAuthProvider><BookingDraftProvider><StatusBar style="dark" /><Stack screenOptions={{ headerShown: false, animation: "fade" }} /></BookingDraftProvider></CustomerAuthProvider></AppStartupProvider></ThemeProvider></SafeAreaProvider></GestureHandlerRootView>;
}
