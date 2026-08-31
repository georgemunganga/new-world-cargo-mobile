import { StyleSheet, Text, View } from "react-native";
import { router } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, PrimaryButton, Screen, SecondaryButton, StatusBadge } from "@/components/ui/nwc-ui";
import { mockInvoice } from "@/lib/mock-billing";
import { nwcColors } from "@/lib/nwc-theme";

export default function ReceiptScreen() {
  return <Screen><View style={styles.page}><View style={styles.hero}><View style={styles.heroIcon}><AppIcon name="check" size={34} color={nwcColors.primaryInk} /></View><Text style={styles.eyebrow}>Mock receipt</Text><Text style={styles.title}>Payment received</Text><Text style={styles.detail}>This receipt is a frontend preview. A connected payment service will issue the final reference and share options.</Text></View><Card style={styles.receipt}><View style={styles.receiptTop}><View><Text style={styles.reference}>{mockInvoice.reference}</Text><Text style={styles.description}>{mockInvoice.description}</Text></View><StatusBadge label="Paid" tone="success" icon="check-circle-outline" /></View><ReceiptRow label="Amount" value={mockInvoice.amount} emphasis /><ReceiptRow label="Payment method" value="Mobile money · mock" /><ReceiptRow label="Shipment" value={mockInvoice.shipmentReference} /><ReceiptRow label="Receipt status" value="Available in this preview" /></Card><View style={styles.actions}><PrimaryButton label="Back to Bills" icon="receipt-text-outline" onPress={() => router.replace("/bills")} /><SecondaryButton label="Return Home" onPress={() => router.replace("/")} /></View></View></Screen>;
}

function ReceiptRow({ label, value, emphasis = false }: { label: string; value: string; emphasis?: boolean }) { return <View style={styles.row}><Text style={styles.rowLabel}>{label}</Text><Text style={[styles.rowValue, emphasis && styles.rowValueEmphasis]}>{value}</Text></View>; }

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 24, justifyContent: "center", gap: 27 },
  hero: { alignItems: "center", gap: 7 },
  heroIcon: { width: 74, height: 74, borderRadius: 27, backgroundColor: nwcColors.primary, justifyContent: "center", alignItems: "center", marginBottom: 5 },
  eyebrow: { color: nwcColors.success, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.7, textTransform: "uppercase" },
  title: { color: nwcColors.foreground, fontSize: 28, lineHeight: 36, fontFamily: "Poppins_800ExtraBold", textAlign: "center" },
  detail: { color: nwcColors.muted, fontSize: 14, lineHeight: 20, fontFamily: "Poppins_500Medium", textAlign: "center" },
  receipt: { paddingVertical: 4 },
  receiptTop: { paddingVertical: 12, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  reference: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.6 },
  description: { color: nwcColors.foreground, fontSize: 15, lineHeight: 21, fontFamily: "Poppins_800ExtraBold", marginTop: 3 },
  row: { paddingVertical: 13, borderTopWidth: 1, borderTopColor: nwcColors.border, flexDirection: "row", justifyContent: "space-between", gap: 16 },
  rowLabel: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_600SemiBold" },
  rowValue: { flexShrink: 1, color: nwcColors.foreground, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_700Bold", textAlign: "right" },
  rowValueEmphasis: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 21, fontFamily: "Poppins_800ExtraBold" },
  actions: { gap: 10 },
});
