import { ListSkeleton } from "@/components/ui/skeleton";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton, PrimaryButton, Screen } from "@/components/ui/nwc-ui";
import { toUiShipment } from "@/lib/mappers/shipment-ui-mapper";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerShipment } from "@/lib/use-cases/use-customer-shipment";

export default function OrderDetailsScreen() {
  const { shipmentId } = useLocalSearchParams<{ shipmentId: string }>();
  const shipmentState = useCustomerShipment(shipmentId);
  const shipment = shipmentState.shipment ? toUiShipment(shipmentState.shipment) : null;
  if (!shipment) return <OrderStateScreen status={shipmentState.status} message={shipmentState.errorMessage} onRetry={shipmentState.refresh} />;
  const rows = [["Tracking number", shipment.reference], ["Service", shipment.service === "local" ? "Local Delivery" : shipment.service === "intercity" ? "City-to-City" : "International Imports"], ["From", `${shipment.pickup.detail}, ${shipment.pickup.area}`], ["To", `${shipment.destination.detail}, ${shipment.destination.area}`]];
  return <Screen><View style={styles.page}><View style={styles.header}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={styles.headerTitle}>Order details</Text><View style={styles.spacer} /></View><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.card}>{rows.map(([label, value], index) => <View key={label} style={[styles.row, index !== rows.length - 1 && styles.divider]}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>)}</View><Text style={styles.note}>This is a concise order summary from your shipment record.</Text></ScrollView></View></Screen>;
}

function OrderStateScreen({ status, message, onRetry }: { status: "idle" | "loading" | "success" | "not-found" | "error"; message?: string; onRetry: () => void }) {
  if (status === "loading" || status === "idle") return <Screen><View style={{padding:20, gap:16}}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><ListSkeleton kind="shipment" count={2} /></View></Screen>;
  const isError = status === "error";
  const title = isError ? "Order could not load" : "Order not found";
  const detail = isError ? message || "Try again when your connection is stable." : "Check the shipment reference and try again.";
  return <Screen><View style={styles.statePage}><View style={styles.stateIcon}><AppIcon name={isError ? "alert-circle-outline" : "package-variant"} size={30} color={nwcColors.primaryInk} /></View><Text style={styles.stateTitle}>{title}</Text><Text style={styles.stateDetail}>{detail}</Text>{isError ? <PrimaryButton label="Try again" onPress={onRetry} /> : null}</View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 16 },
  header: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
  spacer: { width: 44, height: 44 },
  content: { paddingTop: 24, paddingBottom: 42, gap: 16 },
  card: { overflow: "hidden", borderRadius: 23, backgroundColor: nwcColors.surface, borderWidth: 1, borderColor: "#E5EBED", paddingHorizontal: 16 },
  row: { minHeight: 74, justifyContent: "center", gap: 3 },
  divider: { borderBottomWidth: 1, borderBottomColor: "#E9EEEF" },
  label: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  value: { color: nwcColors.foreground, fontSize: 15, lineHeight: 21, fontFamily: "Poppins_700Bold" },
  note: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium", textAlign: "center", paddingHorizontal: 16 },
  statePage: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30, gap: 9, backgroundColor: nwcColors.background },
  stateIcon: { width: 68, height: 68, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary, marginBottom: 6 },
  stateTitle: { color: nwcColors.foreground, fontSize: 23, lineHeight: 29, fontFamily: "Poppins_800ExtraBold", textAlign: "center" },
  stateDetail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium", textAlign: "center" },
});
