import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, PrimaryButton, Screen, SecondaryButton, StatusBadge } from "@/components/ui/nwc-ui";
import { exportReceipt } from "@/lib/customer-document-export";
import { nwcColors } from "@/lib/nwc-theme";
import { useMockBilling } from "@/stores/mock-billing";

export default function ReceiptScreen() {
  const { invoices, lastPaidInvoiceId, selectedInvoice } = useMockBilling();
  const invoice = invoices.find((item) => item.id === lastPaidInvoiceId) ?? selectedInvoice ?? invoices.find((item) => item.status === "paid") ?? invoices[0];
  const downloadReceipt = () => { const result = exportReceipt(invoice); Alert.alert(result.status === "downloaded" ? "Receipt downloaded" : "Receipt ready", result.status === "downloaded" ? `${result.filename} was downloaded to your browser.` : "This preview can download receipts in a browser. Native save/share will be connected later."); };
  return <Screen><View style={styles.page}><View style={styles.hero}><View style={styles.heroIcon}><AppIcon name="check" size={34} color={nwcColors.primaryInk} /></View><Text style={styles.eyebrow}>Mock receipt</Text><Text style={styles.title}>Payment received</Text><Text style={styles.detail}>Download this development receipt now. A connected payment service will issue the final production reference later.</Text></View><Card style={styles.receipt}><View style={styles.receiptTop}><View><Text style={styles.reference}>{invoice.reference}</Text><Text style={styles.description}>{invoice.description}</Text></View><StatusBadge label="Paid" tone="success" icon="check-circle-outline" /></View><ReceiptRow label="Amount" value={invoice.amount} emphasis /><ReceiptRow label="Payment method" value={`${invoice.paymentMethod ?? "Mobile money"} · mock`} /><ReceiptRow label="Shipment" value={invoice.shipmentReference} /><ReceiptRow label="Receipt status" value="Ready to download" /></Card><TouchableOpacity accessibilityRole="button" accessibilityLabel="Download receipt" onPress={downloadReceipt} activeOpacity={0.74} style={styles.documentAction}><AppIcon name="share-variant-outline" size={19} color={nwcColors.brandNavy} /><Text style={styles.documentText}>Download receipt</Text></TouchableOpacity><View style={styles.actions}><PrimaryButton label="Back to Bills" icon="receipt-text-outline" onPress={() => router.replace("/bills")} /><SecondaryButton label="Receipt history" onPress={() => router.replace("/bills/receipts")} /></View></View></Screen>;
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
  documentAction: { minHeight: 48, borderRadius: 16, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#EFF5F6" }, documentText: { color: nwcColors.brandNavy, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" }, actions: { gap: 10 },
});
