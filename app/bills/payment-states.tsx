import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, Screen, SectionHeader, StatusBadge } from "@/components/ui/nwc-ui";
import { mockPaymentPresentation, type MockPaymentState } from "@/lib/mock-billing";
import { nwcColors } from "@/lib/nwc-theme";
import { useMockBilling } from "@/stores/mock-billing";

const states: MockPaymentState[] = ["ready", "pending", "confirmed", "failed", "cancelled", "delayed", "refunded"];

export default function PaymentStatesScreen() {
  const { paymentState, setPaymentState } = useMockBilling();
  const choose = (state: MockPaymentState) => { setPaymentState(state); router.replace("/bills/payment-status" as Href); };
  return <Screen><View style={styles.page}><View style={styles.header}><View><Text style={styles.eyebrow}>Development controls</Text><SectionHeader title="Payment states" /></View><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /></View><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.banner}><AppIcon name="flask-outline" size={20} color={nwcColors.primaryInk} /><Text style={styles.bannerText}>Set a payment outcome to review the customer language and recovery path. No money or external provider is involved.</Text></View>{states.map((state) => { const item = mockPaymentPresentation(state); return <TouchableOpacity key={state} accessibilityRole="button" accessibilityLabel={`Preview ${item.eyebrow}`} onPress={() => choose(state)} activeOpacity={0.76}><Card style={[styles.card, paymentState === state && styles.selected]}><View style={styles.cardCopy}><Text style={styles.cardTitle}>{item.eyebrow}</Text><Text style={styles.cardDetail}>{item.title}</Text></View>{paymentState === state ? <StatusBadge label="Selected" tone="success" icon="check" /> : <AppIcon name="chevron-right" size={21} color={nwcColors.muted} />}</Card></TouchableOpacity>; })}</ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingTop: 16, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 2 },
  content: { gap: 10, paddingTop: 14, paddingBottom: 30 },
  banner: { flexDirection: "row", alignItems: "flex-start", gap: 9, padding: 14, borderRadius: 16, backgroundColor: "#FBF0D8", marginBottom: 3 },
  bannerText: { color: nwcColors.warning, flex: 1, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_600SemiBold" },
  card: { minHeight: 74, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  selected: { borderColor: nwcColors.success, backgroundColor: "#F0F9F5" },
  cardCopy: { flex: 1, gap: 2 },
  cardTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  cardDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_500Medium" },
});
