import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { ShipmentCard } from "@/components/domain/cargo-cards";
import { Screen, SectionHeader } from "@/components/ui/nwc-ui";
import { shipments } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";

export default function ShipmentsScreen() {
  const [showAll, setShowAll] = useState(false);
  const displayedShipments = useMemo(() => showAll ? shipments : shipments.filter((shipment) => shipment.status !== "delivered"), [showAll]);
  return <Screen><View style={styles.page}><View style={styles.header}><View><Text style={styles.eyebrow}>Your cargo</Text><SectionHeader title="Shipments" /></View><TouchableOpacity accessibilityRole="button" accessibilityLabel={showAll ? "Show active shipments" : "Show all shipments"} accessibilityHint="Changes the shipment list filter" onPress={() => setShowAll((current) => !current)} style={styles.filterButton}><Text style={styles.filterText}>{showAll ? "All" : "Active"}</Text><Text style={styles.filterCaret}>⌄</Text></TouchableOpacity></View><FlatList data={displayedShipments} keyExtractor={(shipment) => shipment.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => <ShipmentCard shipment={item} onPress={() => router.push(`/shipments/${item.id}` as Href)} />} ListHeaderComponent={<Text style={styles.description}>{showAll ? "All sample shipments in this frontend preview." : "Your active and action-required sample shipments."}</Text>} /></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 22 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 2 },
  filterButton: { minHeight: 36, borderRadius: 12, paddingHorizontal: 11, backgroundColor: "#EAF1F4", flexDirection: "row", alignItems: "center", gap: 4, marginTop: 5 },
  filterText: { color: nwcColors.brandNavy, fontSize: 12, lineHeight: 16, fontWeight: "800" },
  filterCaret: { color: nwcColors.brandNavy, fontSize: 17, lineHeight: 18, fontWeight: "800", marginTop: -3 },
  description: { color: nwcColors.muted, fontSize: 14, lineHeight: 20, fontWeight: "500", marginTop: 4, marginBottom: 18 },
  list: { paddingBottom: 30, gap: 12 },
});
