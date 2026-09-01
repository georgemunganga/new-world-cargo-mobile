import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { IconButton, Screen } from "@/components/ui/nwc-ui";
import { shipments } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";

export default function OrderDetailsScreen() {
  const { shipmentId } = useLocalSearchParams<{ shipmentId: string }>();
  const shipment = shipments.find((item) => item.id === shipmentId) ?? shipments[0];
  const rows = [["Tracking number", shipment.reference], ["Service", shipment.service === "local" ? "Local Delivery" : shipment.service === "intercity" ? "City-to-City" : "International Imports"], ["From", `${shipment.pickup.detail}, ${shipment.pickup.area}`], ["To", `${shipment.destination.detail}, ${shipment.destination.area}`]];
  return <Screen><View style={styles.page}><View style={styles.header}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={styles.headerTitle}>Order details</Text><View style={styles.spacer} /></View><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.card}>{rows.map(([label, value], index) => <View key={label} style={[styles.row, index !== rows.length - 1 && styles.divider]}><Text style={styles.label}>{label}</Text><Text style={styles.value}>{value}</Text></View>)}</View><Text style={styles.note}>This is a concise frontend-only order summary. Full delivery records will be added when live shipment data is connected.</Text></ScrollView></View></Screen>;
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
});
