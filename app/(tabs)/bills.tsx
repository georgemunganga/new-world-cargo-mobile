import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, Screen, SectionHeader, StatusBadge } from "@/components/ui/nwc-ui";
import { mockInvoice } from "@/lib/mock-billing";
import { nwcColors } from "@/lib/nwc-theme";

export default function BillsScreen() {
  return <Screen><View style={styles.page}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View><Text style={styles.eyebrow}>Your account</Text><SectionHeader title="Bills" /><Text style={styles.detail}>Review estimates, invoices, receipts, credits, and your assigned cargo wallet here.</Text></View><Card style={styles.walletCard}><View style={styles.walletIcon}><AppIcon name="wallet-outline" size={26} color={nwcColors.primaryInk} /></View><View style={styles.walletCopy}><Text style={styles.walletOverline}>Cargo wallet</Text><Text style={styles.walletTitle}>Payment controls</Text><Text style={styles.walletDetail}>Mock payment, refund, and receipt states are available for review.</Text></View></Card><SectionHeader eyebrow="Action required" title="Invoice ready" /><TouchableOpacity accessibilityRole="button" accessibilityLabel={`Review invoice ${mockInvoice.reference}`} accessibilityHint={`${mockInvoice.description}, ${mockInvoice.amount}`} onPress={() => router.push("/bills/payment" as Href)} activeOpacity={0.78}><Card style={styles.invoiceCard}><View style={styles.invoiceIcon}><AppIcon name="receipt-text-outline" size={23} color={nwcColors.primaryInk} /></View><View style={styles.invoiceCopy}><Text style={styles.invoiceRef}>{mockInvoice.reference}</Text><Text style={styles.invoiceTitle}>{mockInvoice.description}</Text><Text style={styles.invoiceDetail}>{`${mockInvoice.amount} · Review payment options`}</Text></View><StatusBadge label="Due" tone="warning" /></Card></TouchableOpacity><SectionHeader eyebrow="Recent activity" title="Payment history" /><View style={styles.emptyState}><View style={styles.emptyIcon}><AppIcon name="receipt-text-outline" size={28} color={nwcColors.info} /></View><Text style={styles.emptyTitle}>No completed receipt yet</Text><Text style={styles.emptyDetail}>Confirm the mock payment to review a customer-facing receipt. Live amounts, transactions, and refunds will connect later.</Text><StatusBadge label="Frontend-only view" tone="info" icon="information-outline" /></View><TouchableOpacity accessibilityRole="button" accessibilityLabel="Open payment-state gallery" onPress={() => router.push("/bills/payment-states" as Href)} style={styles.devLink}><AppIcon name="flask-outline" size={18} color={nwcColors.info} /><Text style={styles.devLinkText}>Preview payment outcomes</Text><AppIcon name="chevron-right" size={19} color={nwcColors.info} /></TouchableOpacity></ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 126, gap: 19 },
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
  invoiceCard: { minHeight: 92, flexDirection: "row", alignItems: "center", gap: 12 },
  invoiceIcon: { width: 46, height: 46, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  invoiceCopy: { flex: 1, gap: 2 },
  invoiceRef: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontWeight: "800", letterSpacing: 0.5 },
  invoiceTitle: { color: nwcColors.foreground, fontSize: 15, lineHeight: 20, fontWeight: "800" },
  invoiceDetail: { color: nwcColors.info, fontSize: 12, lineHeight: 17, fontWeight: "700" },
  devLink: { minHeight: 50, flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 13, borderRadius: 15, backgroundColor: "#EAF4F8" },
  devLinkText: { flex: 1, color: nwcColors.info, fontSize: 13, lineHeight: 18, fontWeight: "800" },
});
