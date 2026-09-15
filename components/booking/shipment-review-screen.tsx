import type { ComponentProps } from "react";
import { ScrollView, View, Text } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Screen, IconButton, PrimaryButton } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";
import type { BookingScreen } from "./booking-ui";
export function ShipmentReviewScreen({ title, detail, children, continueLabel, continueDisabled, onContinue }: ComponentProps<typeof BookingScreen>) {
  const insets = useSafeAreaInsets();
  return <Screen><View style={{ flex: 1 }}><View style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 10, gap: 12 }}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={{ flex: 1, fontSize: 22, color: nwcColors.brandNavy, fontFamily: "Poppins_700Bold" }}>{title}</Text></View><ScrollView contentContainerStyle={{ padding: 20, gap: 20, paddingBottom: 28 }} keyboardShouldPersistTaps="handled"><Text style={{ color: nwcColors.muted, fontSize: 13, lineHeight: 19 }}>{detail}</Text>{children}</ScrollView><View style={{ padding: 16, paddingBottom: Math.max(insets.bottom, 16), borderTopWidth: 1, borderColor: nwcColors.border }}><PrimaryButton label={continueLabel} disabled={continueDisabled} onPress={onContinue} icon="arrow-right" /></View></View></Screen>;
}
