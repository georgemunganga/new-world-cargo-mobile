import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, PrimaryButton, Screen, SecondaryButton, StatusBadge } from "@/components/ui/nwc-ui";
import { mockInvoice } from "@/lib/mock-billing";
import { nwcColors } from "@/lib/nwc-theme";
import { useMockBilling } from "@/stores/mock-billing";

export default function PaymentScreen() {
  const { setPaymentState } = useMockBilling();
  const [method, setMethod] = useState<"mobile" | "card" | "wallet">("mobile");
  const beginPayment = () => { setPaymentState("pending"); router.push("/bills/payment-status" as Href); };
  return <Screen><View style={styles.page}><View style={styles.header}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={styles.headerTitle}>Payment</Text><View style={styles.headerSpacer} /></View><View style={styles.content}><View style={styles.titleBlock}><Text style={styles.title}>Pay {mockInvoice.amount}</Text><Text style={styles.detail}>{mockInvoice.description}</Text></View><Card style={styles.invoice}><View style={styles.invoiceTop}><Text style={styles.invoiceReference}>{mockInvoice.reference}</Text><StatusBadge label="Due" tone="warning" /></View><Text style={styles.shipment}>{`For shipment ${mockInvoice.shipmentReference}`}</Text></Card><View style={styles.methods}><Text style={styles.methodsTitle}>Pay with</Text><PaymentMethod icon="cellphone" title="Mobile money" selected={method === "mobile"} onPress={() => setMethod("mobile")} /><PaymentMethod icon="bank-outline" title="Bank card" selected={method === "card"} onPress={() => setMethod("card")} /><PaymentMethod icon="wallet-outline" title="Cargo wallet" selected={method === "wallet"} onPress={() => setMethod("wallet")} /></View><View style={styles.actions}><PrimaryButton label="Continue to payment" icon="arrow-right" onPress={beginPayment} /><SecondaryButton label="Cancel" onPress={() => router.back()} /></View></View></View></Screen>;
}

function PaymentMethod({ icon, title, selected = false, onPress }: { icon: "cellphone" | "bank-outline" | "wallet-outline"; title: string; selected?: boolean; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={title} accessibilityHint={`Use ${title} for this payment`} activeOpacity={0.77} onPress={onPress} style={[styles.method, selected && styles.methodSelected]}><View style={[styles.methodIcon, selected && styles.methodIconSelected]}><AppIcon name={icon} size={21} color={selected ? nwcColors.primaryInk : nwcColors.brandNavy} /></View><Text style={styles.methodTitle}>{title}</Text><View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <View style={styles.radioDot} /> : null}</View></TouchableOpacity>;
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
  methodTitle: { color: nwcColors.foreground, flex: 1, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  radio: { height: 20, width: 20, borderRadius: 10, borderWidth: 1.5, borderColor: nwcColors.border, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: nwcColors.brandNavy },
  radioDot: { height: 10, width: 10, borderRadius: 5, backgroundColor: nwcColors.brandNavy },
  actions: { gap: 10, marginTop: "auto", paddingBottom: 16 },
});
