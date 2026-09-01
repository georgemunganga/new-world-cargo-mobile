import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, PrimaryButton, Screen, SecondaryButton, StatusBadge } from "@/components/ui/nwc-ui";
import { canPayWithMockWallet, formatMockKwacha, paymentMethodLabel } from "@/lib/mock-billing";
import { nwcColors } from "@/lib/nwc-theme";
import { useMockBilling } from "@/stores/mock-billing";

export default function PaymentScreen() {
  const { selectedInvoice, setPaymentState, selectedPaymentMethod, setSelectedPaymentMethod, walletBalance } = useMockBilling();
  const invoice = selectedInvoice;
  const method = selectedPaymentMethod;
  const beginPayment = () => { setPaymentState("pending"); router.push("/bills/payment-status" as Href); };
  if (!invoice) return null;
  const walletAvailable = canPayWithMockWallet(walletBalance, invoice);
  return <Screen><View style={styles.page}><View style={styles.header}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={styles.headerTitle}>Payment</Text><View style={styles.headerSpacer} /></View><View style={styles.content}><View style={styles.titleBlock}><Text style={styles.title}>Pay {invoice.amount}</Text><Text style={styles.detail}>{invoice.description}</Text></View><Card style={styles.invoice}><View style={styles.invoiceTop}><Text style={styles.invoiceReference}>{invoice.reference}</Text><StatusBadge label="Due" tone="warning" /></View><Text style={styles.shipment}>{`For shipment ${invoice.shipmentReference}`}</Text></Card><View style={styles.methods}><Text style={styles.methodsTitle}>Pay with</Text><PaymentMethod icon="cellphone" title="Mobile money" selected={method === "mobile"} onPress={() => setSelectedPaymentMethod("mobile")} /><PaymentMethod icon="bank-outline" title="Bank card" selected={method === "card"} onPress={() => setSelectedPaymentMethod("card")} /><PaymentMethod icon="wallet-outline" title="Cargo wallet" subtitle={`Available ${formatMockKwacha(walletBalance)}${walletAvailable ? "" : " · Add balance first"}`} selected={method === "wallet"} onPress={() => setSelectedPaymentMethod("wallet")} /></View>{method === "wallet" && !walletAvailable ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Add mock wallet balance" onPress={() => router.push("/bills/wallet" as Href)} style={styles.walletWarning}><AppIcon name="alert-circle-outline" size={18} color={nwcColors.warning} /><Text style={styles.walletWarningText}>This wallet needs {formatMockKwacha(invoice.amountValue - walletBalance)} more. Add mock balance.</Text></TouchableOpacity> : null}<View style={styles.actions}><PrimaryButton label={`Pay with ${paymentMethodLabel(method)}`} icon="arrow-right" onPress={beginPayment} /><SecondaryButton label="Cancel" onPress={() => router.back()} /></View></View></View></Screen>;
}

function PaymentMethod({ icon, title, subtitle, selected = false, onPress }: { icon: "cellphone" | "bank-outline" | "wallet-outline"; title: string; subtitle?: string; selected?: boolean; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={title} accessibilityHint={`Use ${title} for this payment`} activeOpacity={0.77} onPress={onPress} style={[styles.method, selected && styles.methodSelected]}><View style={[styles.methodIcon, selected && styles.methodIconSelected]}><AppIcon name={icon} size={21} color={selected ? nwcColors.primaryInk : nwcColors.brandNavy} /></View><View style={styles.methodCopy}><Text style={styles.methodTitle}>{title}</Text>{subtitle ? <Text style={styles.methodSubtitle}>{subtitle}</Text> : null}</View><View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <View style={styles.radioDot} /> : null}</View></TouchableOpacity>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 16 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
  headerSpacer: { height: 44, width: 44 },
  content: { flex: 1, paddingTop: 24, gap: 20 },
  titleBlock: { gap: 3 },
  title: { color: nwcColors.foreground, fontSize: 30, lineHeight: 38, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.5 },
  detail: { color: nwcColors.muted, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_500Medium" },
  invoice: { minHeight: 80, gap: 9, borderRadius: 22, backgroundColor: "#F3F7F8" },
  invoiceTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  invoiceReference: { color: nwcColors.brandNavy, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.6 },
  shipment: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_600SemiBold" },
  methods: { gap: 9 },
  methodsTitle: { color: nwcColors.foreground, fontSize: 17, lineHeight: 23, fontFamily: "Poppins_800ExtraBold", marginBottom: 1 },
  method: { minHeight: 64, borderWidth: 1, borderColor: nwcColors.border, borderRadius: 19, padding: 11, flexDirection: "row", alignItems: "center", gap: 11, backgroundColor: nwcColors.surface },
  methodSelected: { borderColor: nwcColors.brandNavy, backgroundColor: "#F2F8FA" },
  methodIcon: { height: 42, width: 42, borderRadius: 14, justifyContent: "center", alignItems: "center", backgroundColor: "#EAF1F4" },
  methodIconSelected: { backgroundColor: nwcColors.primary },
  methodCopy: { flex: 1, gap: 1 }, methodTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" }, methodSubtitle: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_500Medium" },
  radio: { height: 20, width: 20, borderRadius: 10, borderWidth: 1.5, borderColor: nwcColors.border, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: nwcColors.brandNavy },
  radioDot: { height: 10, width: 10, borderRadius: 5, backgroundColor: nwcColors.brandNavy },
  walletWarning: { borderRadius: 15, padding: 11, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "#FFF4DA" }, walletWarningText: { flex: 1, color: "#745100", fontSize: 11, lineHeight: 16, fontFamily: "Poppins_700Bold" }, actions: { gap: 10, marginTop: "auto", paddingBottom: 16 },
});
