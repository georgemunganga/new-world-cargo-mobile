import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, PrimaryButton, Screen, SecondaryButton, StatusBadge } from "@/components/ui/nwc-ui";
import { mockInvoice } from "@/lib/mock-billing";
import { nwcColors } from "@/lib/nwc-theme";
import { useMockBilling } from "@/stores/mock-billing";

export default function PaymentScreen() {
  const { setPaymentState } = useMockBilling();
  const beginPayment = () => { setPaymentState("pending"); router.push("/bills/payment-status" as Href); };
  return <Screen><View style={styles.page}><View style={styles.header}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={styles.headerTitle}>Pay bill</Text><View style={styles.headerSpacer} /></View><View style={styles.content}><View><Text style={styles.eyebrow}>Mock payment</Text><Text style={styles.title}>Review payment</Text><Text style={styles.detail}>No money will be collected in this frontend build. The states below are for customer-experience review.</Text></View><Card style={styles.invoice}><View style={styles.invoiceTop}><View><Text style={styles.invoiceReference}>{mockInvoice.reference}</Text><Text style={styles.invoiceDescription}>{mockInvoice.description}</Text></View><StatusBadge label="Due" tone="warning" icon="alert-circle-outline" /></View><View style={styles.amountBlock}><Text style={styles.amountLabel}>Amount to pay</Text><Text style={styles.amount}>{mockInvoice.amount}</Text><Text style={styles.currency}>{mockInvoice.currencyDetail}</Text></View><View style={styles.divider} /><Text style={styles.shipment}>{`For shipment ${mockInvoice.shipmentReference}`}</Text></Card><View style={styles.methods}><Text style={styles.methodsTitle}>Select a payment method</Text><PaymentMethod icon="cellphone" title="Mobile money" detail="Fast payment confirmation in the connected app" selected /><PaymentMethod icon="bank-outline" title="Bank card" detail="Available when the live payment provider is connected" /><PaymentMethod icon="wallet-outline" title="Cargo wallet" detail="Available balance and credits will appear here" /></View><View style={styles.actions}><PrimaryButton label={`Pay ${mockInvoice.amount} (mock)`} icon="lock-outline" onPress={beginPayment} /><SecondaryButton label="Cancel" onPress={() => router.back()} /></View></View></View></Screen>;
}

function PaymentMethod({ icon, title, detail, selected = false }: { icon: "cellphone" | "bank-outline" | "wallet-outline"; title: string; detail: string; selected?: boolean }) {
  return <TouchableOpacity accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={title} accessibilityHint={detail} activeOpacity={0.77} style={[styles.method, selected && styles.methodSelected]}><View style={[styles.methodIcon, selected && styles.methodIconSelected]}><AppIcon name={icon} size={21} color={selected ? nwcColors.primaryInk : nwcColors.brandNavy} /></View><View style={styles.methodCopy}><Text style={styles.methodTitle}>{title}</Text><Text style={styles.methodDetail}>{detail}</Text></View><View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <View style={styles.radioDot} /> : null}</View></TouchableOpacity>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
  headerSpacer: { height: 44, width: 44 },
  content: { flex: 1, paddingTop: 22, gap: 22 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.7, textTransform: "uppercase" },
  title: { color: nwcColors.foreground, fontSize: 29, lineHeight: 37, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.4, marginTop: 3 },
  detail: { color: nwcColors.muted, fontSize: 14, lineHeight: 20, fontFamily: "Poppins_500Medium", marginTop: 4 },
  invoice: { gap: 14 },
  invoiceTop: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  invoiceReference: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.6 },
  invoiceDescription: { color: nwcColors.foreground, fontSize: 16, lineHeight: 22, fontFamily: "Poppins_800ExtraBold", marginTop: 3 },
  amountBlock: { gap: 2 },
  amountLabel: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_700Bold" },
  amount: { color: nwcColors.brandNavy, fontSize: 28, lineHeight: 35, fontFamily: "Poppins_800ExtraBold" },
  currency: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" },
  divider: { height: 1, backgroundColor: nwcColors.border },
  shipment: { color: nwcColors.info, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_700Bold" },
  methods: { gap: 10 },
  methodsTitle: { color: nwcColors.foreground, fontSize: 16, lineHeight: 22, fontFamily: "Poppins_800ExtraBold", marginBottom: 1 },
  method: { minHeight: 76, borderWidth: 1, borderColor: nwcColors.border, borderRadius: 18, padding: 12, flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: nwcColors.surface },
  methodSelected: { borderColor: nwcColors.brandNavy, backgroundColor: "#F2F8FA" },
  methodIcon: { height: 42, width: 42, borderRadius: 14, justifyContent: "center", alignItems: "center", backgroundColor: "#EAF1F4" },
  methodIconSelected: { backgroundColor: nwcColors.primary },
  methodCopy: { flex: 1, gap: 2 },
  methodTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  methodDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" },
  radio: { height: 20, width: 20, borderRadius: 10, borderWidth: 1.5, borderColor: nwcColors.border, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: nwcColors.brandNavy },
  radioDot: { height: 10, width: 10, borderRadius: 5, backgroundColor: nwcColors.brandNavy },
  actions: { gap: 10, marginTop: "auto", paddingBottom: 16 },
});
