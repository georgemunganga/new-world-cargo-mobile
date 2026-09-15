import { mobileInputStyles } from "@/components/ui/mobile-input";
import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";

import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, PrimaryButton, Screen, SecondaryButton } from "@/components/ui/nwc-ui";
import { toUiShipment } from "@/lib/mappers/shipment-ui-mapper";
import { shipmentDestination } from "@/lib/shipment-navigation";
import { nwcColors } from "@/lib/nwc-theme";
import { cameraService } from "@/lib/services/device/camera-service";
import { useCustomerShipments } from "@/lib/use-cases/use-customer-shipments";
import { usePublicTracking } from "@/lib/use-cases/use-public-tracking";

export default function ScanTrackingScreen() {
  const [code, setCode] = useState("");
  const [scannerShown, setScannerShown] = useState(false);
  const [message, setMessage] = useState("");
  const tracking = usePublicTracking();
  const shipmentState = useCustomerShipments();
  const demoCode = shipmentState.shipments[0]?.code ?? "EXP-LUN10001";
  const submit = async () => {
    const result = await tracking.track(code);
    if (!result) {
      setMessage(tracking.errorMessage || "Tracking is taking longer than expected. Please try again.");
      return;
    }
    if (result.kind !== "found") {
      setMessage(result.message);
      return;
    }
    router.replace(shipmentDestination(toUiShipment(result.shipment)) as Href);
  };
  const useDemo = () => { setCode(demoCode); setMessage("Test code added. Continue to open its tracking view."); };
  const openScanner = async () => {
    setScannerShown(true);
    const result = await cameraService.scanQrCode();
    if (result.ok) {
      setCode(result.value.value);
      setMessage("Code scanned. Continue to open its tracking view.");
      return;
    }
    setMessage(result.message);
  };
  return <Screen><View style={styles.page}><View style={styles.header}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={styles.headerTitle}>Track by code</Text><View style={styles.headerSpacer} /></View><View style={styles.content}><View style={styles.lead}><Text style={styles.title}>Scan a shipment</Text><Text style={styles.detail}>Use a tracking label, or enter the code shown on your cargo receipt.</Text></View><Card style={styles.scanner}><View style={styles.scanIcon}><AppIcon name="qrcode-scan" size={43} color={nwcColors.primaryInk} /></View><Text style={styles.scanTitle}>{scannerShown ? "Camera scanner" : "Use your cargo code"}</Text><Text style={styles.scanDetail}>{scannerShown ? "If camera access is not available on this device, type the tracking code below." : "Open the scanner or type the shipment code below."}</Text><SecondaryButton label={scannerShown ? "Use typed code" : "Open scanner"} icon="qrcode-scan" onPress={scannerShown ? () => setScannerShown(false) : openScanner} /></Card><View style={styles.form}><Text style={styles.label}>Tracking code</Text><View style={[styles.inputShell, mobileInputStyles.frame]}><AppIcon name="barcode-scan" size={20} color={nwcColors.info} /><TextInput accessibilityLabel="Tracking code" value={code} onChangeText={(value) => { setCode(value); setMessage(""); }} autoCapitalize="characters" placeholder="Tracking number" placeholderTextColor="#91A0AE" returnKeyType="go" onSubmitEditing={submit} style={[styles.input, mobileInputStyles.text]} /></View>{message ? <Text accessibilityRole="alert" style={styles.message}>{message}</Text> : null}<PrimaryButton label={tracking.status === "loading" ? "Checking..." : "Track shipment"} icon="arrow-right" disabled={!code.trim() || tracking.status === "loading"} onPress={submit} /></View>{__DEV__ ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Use test tracking code" onPress={useDemo} style={styles.demo}><Text style={styles.demoText}>Use test code: {demoCode}</Text><AppIcon name="chevron-right" size={18} color={nwcColors.info} /></TouchableOpacity> : null}</View></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: 20, paddingTop: 16, backgroundColor: nwcColors.background }, header: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerTitle: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" }, headerSpacer: { width: 44, height: 44 }, content: { flex: 1, paddingTop: 24, gap: 18 }, lead: { gap: 4 }, title: { color: nwcColors.foreground, fontSize: 29, lineHeight: 37, letterSpacing: -0.5, fontFamily: "Poppins_800ExtraBold" }, detail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium" }, scanner: { alignItems: "center", paddingVertical: 24, gap: 7, backgroundColor: nwcColors.surfaceNavyTint }, scanIcon: { width: 76, height: 76, borderRadius: 27, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary }, scanTitle: { color: nwcColors.foreground, fontSize: 17, lineHeight: 23, fontFamily: "Poppins_800ExtraBold" }, scanDetail: { maxWidth: 260, color: nwcColors.muted, textAlign: "center", fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" }, form: { gap: 9 }, label: { color: nwcColors.foreground, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" }, inputShell: { minHeight: 54, paddingHorizontal: 13, borderWidth: 1, borderColor: "#DCE6E8", borderRadius: 17, backgroundColor: nwcColors.surfaceElevated, alignItems: "center", flexDirection: "row", gap: 9 }, input: { flex: 1, minHeight: 52, color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_600SemiBold" }, message: { color: nwcColors.info, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_600SemiBold" }, demo: { minHeight: 48, paddingHorizontal: 12, borderRadius: 16, alignItems: "center", justifyContent: "space-between", flexDirection: "row", backgroundColor: "#F2F7F8" }, demoText: { color: nwcColors.info, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold" },
});
