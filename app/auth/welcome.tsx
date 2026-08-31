import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { AuthScreen } from "@/components/auth/auth-shell";
import { nwcColors } from "@/lib/nwc-theme";

export default function WelcomeScreen() {
  return <AuthScreen title="Move your Katundu with confidence." detail="Book Local Delivery, follow shipments, and keep your cargo updates in one place." primaryLabel="Continue with phone" onPrimary={() => router.push("/auth/phone" as Href)}><View style={styles.valueList}><ValueRow icon="map-marker-path" text="Book pickup and delivery in a few steps" /><ValueRow icon="package-variant-closed" text="Follow every shipment with clear updates" /><ValueRow icon="receipt-text-outline" text="Keep estimates, bills, and receipts together" /></View><Text style={styles.note}>Your phone number helps secure your account and shipment updates.</Text></AuthScreen>;
}

function ValueRow({ icon, text }: { icon: "map-marker-path" | "package-variant-closed" | "receipt-text-outline"; text: string }) {
  return <View style={styles.valueRow}><View style={styles.valueIcon}><AppIcon name={icon} size={21} color={nwcColors.primaryInk} /></View><Text style={styles.valueText}>{text}</Text></View>;
}

const styles = StyleSheet.create({
  valueList: { gap: 13 },
  valueRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  valueIcon: { height: 42, width: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  valueText: { color: nwcColors.foreground, flex: 1, fontSize: 14, lineHeight: 20, fontFamily: "Poppins_700Bold" },
  note: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium", marginTop: 8 },
});
