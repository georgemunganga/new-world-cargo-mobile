import { useState } from "react";
import { ActivityIndicator, Modal, Platform, Pressable, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { BlurView } from "expo-blur";
import { router, type Href } from "expo-router";

import { AppIcon } from "@/components/ui/app-icon";
import { PrimaryButton, SecondaryButton } from "@/components/ui/nwc-ui";
import { shipments } from "@/lib/mock-cargo-data";
import { shipmentDestination } from "@/lib/shipment-navigation";
import { nwcColors } from "@/lib/nwc-theme";
import { resolvePublicTrackingLookup } from "@/lib/public-tracking-lookup";

type TrackingLookupContentProps = { onDismiss?: () => void; mode: "overlay" | "screen" };

function TrackingLookupContent({ onDismiss, mode }: TrackingLookupContentProps) {
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "not-found" | "unavailable">("idle");
  const search = () => {
    setState("loading");
    setTimeout(() => {
      const result = resolvePublicTrackingLookup(code, shipments);
      if (result.kind === "found") { onDismiss?.(); router.push(shipmentDestination(result.shipment) as Href); return; }
      setState(result.kind);
    }, 420);
  };
  const useDemo = () => { setCode(shipments[0].reference); setState("idle"); };
  const alert = state === "unavailable" ? "Tracking is temporarily unavailable. Please try again." : state === "not-found" ? (code.trim() ? "Shipment not found. Check the code and try again." : "Enter a tracking number to continue.") : undefined;
  return <View style={[styles.panel, mode === "screen" && styles.panelScreen]}><View style={styles.headingRow}><View style={styles.brandIcon}><AppIcon name="package-variant-closed" size={22} color={nwcColors.primaryInk} /></View>{onDismiss ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Close tracking search" onPress={onDismiss} style={styles.close}><AppIcon name="close" size={20} color={nwcColors.muted} /></TouchableOpacity> : null}</View><View style={styles.copy}><Text style={styles.overline}>New WorldCargo</Text><Text style={styles.title}>Track a shipment</Text><Text style={styles.detail}>Enter your cargo tracking number to see its latest move.</Text></View><View style={styles.form}><Text style={styles.label}>Tracking number</Text><View style={[styles.inputFrame, (state === "not-found" || state === "unavailable") && styles.inputError]}><AppIcon name="barcode-scan" size={20} color={nwcColors.info} /><TextInput autoFocus editable={state !== "loading"} accessibilityLabel="Tracking number" accessibilityHint={alert ?? "Enter a tracking number, then activate Track shipment."} value={code} onChangeText={(value) => { setCode(value); setState("idle"); }} autoCapitalize="characters" placeholder="e.g. NW-784512" placeholderTextColor="#91A0AE" returnKeyType="go" onSubmitEditing={search} style={styles.input} /></View>{alert ? <Text accessibilityRole="alert" style={styles.error}>{alert}</Text> : null}<PrimaryButton label={state === "loading" ? "Looking up shipment" : state === "unavailable" ? "Try again" : "Track shipment"} icon="arrow-right" disabled={state === "loading"} onPress={search} /></View><View style={styles.secondaryActions}><SecondaryButton label="Scan tracking QR" icon="qrcode-scan" onPress={() => { onDismiss?.(); router.push("/tracking/scan" as Href); }} /><TouchableOpacity accessibilityRole="button" accessibilityLabel="Use demo tracking code" onPress={useDemo} style={styles.demo}><Text style={styles.demoText}>Use demo code: {shipments[0].reference}</Text><AppIcon name="chevron-right" size={17} color={nwcColors.info} /></TouchableOpacity></View>{state === "loading" ? <View style={styles.loading}><ActivityIndicator color={nwcColors.info} size="small" /><Text style={styles.loadingText}>Looking up your shipment…</Text></View> : null}<Text style={styles.support}>Need help? Open Support from Account to start a request.</Text></View>;
}

export function TrackingLookupOverlay({ visible, onDismiss }: { visible: boolean; onDismiss: () => void }) {
  return <Modal visible={visible} transparent animationType="fade" statusBarTranslucent onRequestClose={onDismiss}><View style={styles.modal}><BlurView intensity={Platform.OS === "web" ? 30 : 55} tint="light" style={StyleSheet.absoluteFill} experimentalBlurMethod={Platform.OS === "android" ? "dimezisBlurView" : undefined} /><Pressable style={styles.dim} onPress={onDismiss} /><View style={styles.overlayPanel}><TrackingLookupContent mode="overlay" onDismiss={onDismiss} /></View></View></Modal>;
}

export function PublicTrackingLookupScreen() { return <View style={styles.screen}><TrackingLookupContent mode="screen" /></View>; }

const styles = StyleSheet.create({
  modal: { flex: 1, justifyContent: "center", paddingHorizontal: 20, backgroundColor: "rgba(1,38,66,0.26)" }, dim: { ...StyleSheet.absoluteFillObject }, overlayPanel: { maxWidth: 480, alignSelf: "center", width: "100%" }, screen: { flex: 1, justifyContent: "center", paddingHorizontal: 20, backgroundColor: nwcColors.background }, panel: { borderRadius: 28, padding: 20, gap: 18, backgroundColor: "rgba(255,255,255,0.96)", borderWidth: 1, borderColor: "rgba(255,255,255,0.84)", shadowColor: "#012642", shadowOpacity: 0.18, shadowRadius: 30, shadowOffset: { width: 0, height: 14 }, elevation: 8 }, panelScreen: { maxWidth: 480, width: "100%", alignSelf: "center", backgroundColor: nwcColors.surface, borderColor: "#E2EAEC", shadowOpacity: 0.06 }, headingRow: { minHeight: 43, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, brandIcon: { width: 43, height: 43, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary }, close: { width: 42, height: 42, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#F1F5F6" }, copy: { gap: 4 }, overline: { color: nwcColors.info, fontSize: 10, lineHeight: 14, letterSpacing: 0.7, textTransform: "uppercase", fontFamily: "Poppins_800ExtraBold" }, title: { color: nwcColors.foreground, fontSize: 28, lineHeight: 36, letterSpacing: -0.45, fontFamily: "Poppins_800ExtraBold" }, detail: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" }, form: { gap: 8 }, label: { color: nwcColors.foreground, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" }, inputFrame: { minHeight: 55, paddingHorizontal: 13, gap: 9, flexDirection: "row", alignItems: "center", borderRadius: 17, borderWidth: 1, borderColor: "#DCE7EA", backgroundColor: "#FBFDFD" }, inputError: { borderColor: nwcColors.error }, input: { flex: 1, minHeight: 53, color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_600SemiBold" }, error: { color: nwcColors.error, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_600SemiBold" }, secondaryActions: { gap: 8 }, demo: { minHeight: 38, paddingHorizontal: 10, borderRadius: 13, alignItems: "center", justifyContent: "space-between", flexDirection: "row", backgroundColor: "#F4F8F9" }, demoText: { color: nwcColors.info, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold" }, loading: { minHeight: 42, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: nwcColors.surfaceNavyTint, borderRadius: 14 }, loadingText: { color: nwcColors.info, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_700Bold" }, support: { color: nwcColors.muted, textAlign: "center", fontSize: 10, lineHeight: 15, fontFamily: "Poppins_500Medium" },
});
