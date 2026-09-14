import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProgressSteps, type BookingProgressStep } from "@/components/booking/booking-ui";
import { CustomerMap } from "@/components/map/customer-map";
import { IconButton, PrimaryButton, Screen } from "@/components/ui/nwc-ui";
import { deliveryMapModeForService, type DeliveryMapService } from "@/lib/domain/delivery-map";
import { nwcColors } from "@/lib/nwc-theme";
import type { Address } from "@/types/cargo";

type BookingMapRouteShellProps = {
  service: DeliveryMapService;
  serviceLabel: string;
  activeStep: string;
  progressSteps: BookingProgressStep[];
  title: string;
  detail: string;
  pickup?: Address;
  destination?: Address;
  routeReady: boolean;
  continueLabel: string;
  continueDisabled?: boolean;
  onContinue: () => void;
  children: React.ReactNode;
};

export function BookingMapRouteShell({ service, serviceLabel, activeStep, progressSteps, title, detail, pickup, destination, routeReady, continueLabel, continueDisabled, onContinue, children }: BookingMapRouteShellProps) {
  const insets = useSafeAreaInsets();
  return <Screen><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.page}><CustomerMap fill mode={deliveryMapModeForService(service, routeReady)} deliveryService={service} pickup={pickup} destination={destination} routeReady={routeReady} /><View style={styles.topBar}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><View style={styles.topPill}><View style={styles.topPillDot} /><Text style={styles.topPillText}>{serviceLabel}</Text></View><View style={styles.topSpacer} /></View><View style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 16) }]}><View style={styles.grabber} /><ProgressSteps activeStep={activeStep} steps={progressSteps} /><ScrollView keyboardDismissMode="on-drag" keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}><View><Text style={styles.overline}>Map route</Text><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View>{children}<PrimaryButton label={continueLabel} icon="arrow-right" disabled={continueDisabled} onPress={onContinue} /></ScrollView></View></KeyboardAvoidingView></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#EAF0F1" },
  topBar: { position: "absolute", zIndex: 3, top: 14, left: 18, right: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  topPill: { minHeight: 40, paddingHorizontal: 13, borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "rgba(255,255,255,0.95)" },
  topPillDot: { height: 8, width: 8, borderRadius: 4, backgroundColor: nwcColors.primary },
  topPillText: { color: nwcColors.brandNavy, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" },
  topSpacer: { width: 44, height: 44 },
  sheet: { position: "absolute", zIndex: 5, left: 0, right: 0, bottom: 0, maxHeight: "74%", borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: "hidden", backgroundColor: nwcColors.background, shadowColor: "#012642", shadowOffset: { width: 0, height: -7 }, shadowOpacity: 0.15, shadowRadius: 18, elevation: 13 },
  grabber: { alignSelf: "center", width: 43, height: 5, borderRadius: 3, backgroundColor: "#C5D1D6", marginTop: 10, marginBottom: 7 },
  sheetContent: { paddingHorizontal: 20, paddingBottom: 18, gap: 14 },
  overline: { color: nwcColors.info, fontSize: 11, lineHeight: 15, letterSpacing: 0.8, textTransform: "uppercase", fontFamily: "Poppins_800ExtraBold" },
  title: { color: nwcColors.foreground, fontSize: 25, lineHeight: 31, fontFamily: "Poppins_800ExtraBold", marginTop: 1 },
  detail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium", marginTop: 2 },
});
