import { ScrollView, StyleSheet, Text, View } from "react-native";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, Screen, SectionHeader, StatusBadge } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

export default function BillsScreen() {
  return <Screen><View style={styles.page}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View><Text style={styles.eyebrow}>Your account</Text><SectionHeader title="Bills" /><Text style={styles.detail}>Review estimates, invoices, receipts, credits, and your assigned cargo wallet here.</Text></View><Card style={styles.walletCard}><View style={styles.walletIcon}><AppIcon name="wallet-outline" size={26} color={nwcColors.primaryInk} /></View><View style={styles.walletCopy}><Text style={styles.walletOverline}>Cargo wallet</Text><Text style={styles.walletTitle}>No bills due</Text><Text style={styles.walletDetail}>You do not have a payment action at the moment.</Text></View></Card><SectionHeader eyebrow="Recent activity" title="Payment history" /><View style={styles.emptyState}><View style={styles.emptyIcon}><AppIcon name="receipt-text-outline" size={28} color={nwcColors.info} /></View><Text style={styles.emptyTitle}>Nothing to review yet</Text><Text style={styles.emptyDetail}>When an invoice, receipt, refund, or credit is available, you will find it here with clear payment status and actions.</Text><StatusBadge label="Frontend-only view" tone="info" icon="information-outline" /></View></ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 30, gap: 22 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 2 },
  detail: { color: nwcColors.muted, fontSize: 15, lineHeight: 22, fontWeight: "500", marginTop: -4 },
  walletCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: nwcColors.brandNavy, borderColor: nwcColors.brandNavy },
  walletIcon: { height: 52, width: 52, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: nwcColors.primary },
  walletCopy: { flex: 1, gap: 2 },
  walletOverline: { color: "#C5D0D7", fontSize: 11, lineHeight: 15, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase" },
  walletTitle: { color: nwcColors.white, fontSize: 21, lineHeight: 27, fontWeight: "800" },
  walletDetail: { color: "#C5D0D7", fontSize: 12, lineHeight: 17, fontWeight: "600" },
  emptyState: { alignItems: "center", gap: 10, paddingHorizontal: 16, paddingVertical: 22 },
  emptyIcon: { height: 60, width: 60, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "#EAF4F8" },
  emptyTitle: { color: nwcColors.foreground, fontSize: 18, lineHeight: 24, fontWeight: "800", textAlign: "center" },
  emptyDetail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontWeight: "500", textAlign: "center", maxWidth: 320 },
});
