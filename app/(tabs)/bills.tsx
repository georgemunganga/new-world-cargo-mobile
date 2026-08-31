import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, Screen, StatusBadge } from "@/components/ui/nwc-ui";
import { mockInvoice } from "@/lib/mock-billing";
import { nwcColors } from "@/lib/nwc-theme";

export default function BillsScreen() {
  return <Screen><View style={styles.page}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.header}><Text style={styles.title}>Bills</Text><Text style={styles.detail}>One payment needs your attention.</Text></View><TouchableOpacity accessibilityRole="button" accessibilityLabel={`Review invoice ${mockInvoice.reference}`} accessibilityHint={`${mockInvoice.description}, ${mockInvoice.amount}`} onPress={() => router.push("/bills/payment" as Href)} activeOpacity={0.8} style={styles.dueHero}><View style={styles.dueTop}><Text style={styles.dueLabel}>Amount due</Text><StatusBadge label="Due" tone="warning" /></View><Text style={styles.amount}>{mockInvoice.amount}</Text><View style={styles.dueFooter}><Text style={styles.invoiceDescription}>{mockInvoice.description}</Text><AppIcon name="arrow-top-right" size={21} color={nwcColors.primary} /></View></TouchableOpacity><View style={styles.section}><Text style={styles.sectionTitle}>Recent</Text><Card style={styles.historyCard}><View style={styles.historyIcon}><AppIcon name="receipt-text-outline" size={21} color={nwcColors.brandNavy} /></View><View style={styles.historyCopy}><Text style={styles.historyTitle}>Receipts and refunds</Text><Text style={styles.historyDetail}>Nothing completed yet</Text></View><AppIcon name="chevron-right" size={20} color={nwcColors.muted} /></Card></View></ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 126, gap: 26 },
  header: { gap: 4 },
  title: { color: nwcColors.foreground, fontSize: 30, lineHeight: 38, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.5 },
  detail: { color: nwcColors.muted, fontSize: 14, lineHeight: 20, fontFamily: "Poppins_500Medium" },
  dueHero: { minHeight: 166, borderRadius: 28, padding: 19, backgroundColor: nwcColors.brandNavy, justifyContent: "space-between" },
  dueTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  dueLabel: { color: "#B3C4CE", fontSize: 12, lineHeight: 16, fontFamily: "Poppins_700Bold" },
  amount: { color: nwcColors.white, fontSize: 34, lineHeight: 42, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.7 },
  dueFooter: { flexDirection: "row", alignItems: "center", gap: 12, borderTopWidth: 1, borderTopColor: "#28465C", paddingTop: 12 },
  invoiceDescription: { flex: 1, color: "#D6E3E8", fontSize: 13, lineHeight: 18, fontFamily: "Poppins_600SemiBold" },
  section: { gap: 9 },
  sectionTitle: { color: nwcColors.foreground, fontSize: 18, lineHeight: 24, fontFamily: "Poppins_800ExtraBold" },
  historyCard: { minHeight: 76, flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 12 },
  historyIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#EDF3F5" },
  historyCopy: { flex: 1, gap: 1 },
  historyTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  historyDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_500Medium" },
});
