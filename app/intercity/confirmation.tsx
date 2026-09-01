import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { AppIcon } from "@/components/ui/app-icon";
import { PrimaryButton, Screen, SecondaryButton } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";
import { useBookingDraft } from "@/stores/booking-draft";

export default function IntercityConfirmationScreen() { const { resetIntercityDraft } = useBookingDraft(); const home = () => { resetIntercityDraft(); router.replace("/" as never); }; return <Screen><View style={styles.page}><View style={styles.hero}><View style={styles.icon}><AppIcon name="truck-check-outline" size={33} color={nwcColors.primaryInk} /></View><Text style={styles.title}>Quote request received</Text><Text style={styles.detail}>We will confirm the next available City-to-City movement and your shipment quote.</Text></View><View style={styles.actions}><PrimaryButton label="View shipments" onPress={() => { resetIntercityDraft(); router.replace("/shipments" as never); }} /><SecondaryButton label="Back to Home" onPress={home} /></View></View></Screen>; }
const styles = StyleSheet.create({ page: { flex: 1, justifyContent: "space-between", padding: 28, backgroundColor: nwcColors.background }, hero: { alignItems: "center", gap: 12, paddingTop: 96 }, icon: { height: 76, width: 76, borderRadius: 26, backgroundColor: nwcColors.primary, alignItems: "center", justifyContent: "center" }, title: { color: nwcColors.foreground, fontSize: 26, lineHeight: 33, fontFamily: "Poppins_800ExtraBold", textAlign: "center" }, detail: { color: nwcColors.muted, fontSize: 14, lineHeight: 21, fontFamily: "Poppins_500Medium", textAlign: "center" }, actions: { gap: 10 } });
