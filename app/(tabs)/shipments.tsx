import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { ShipmentCard } from "@/components/domain/cargo-cards";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton, Screen, SectionHeader } from "@/components/ui/nwc-ui";
import { shipments } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";

export default function ShipmentsScreen() {
  const [filter, setFilter] = useState<"all" | "active" | "delivered">("all");
  const [query, setQuery] = useState("");
  const displayedShipments = useMemo(() => shipments.filter((shipment) => {
    const matchesFilter = filter === "all" || (filter === "active" ? shipment.status !== "delivered" : shipment.status === "delivered");
    const searchable = `${shipment.reference} ${shipment.title} ${shipment.pickup.area} ${shipment.destination.area} ${shipment.destination.city}`.toLowerCase();
    return matchesFilter && searchable.includes(query.trim().toLowerCase());
  }), [filter, query]);
  const resetFilters = () => { setFilter("all"); setQuery(""); };
  return <Screen><View style={styles.page}><View style={styles.header}><View style={styles.headerCopy}><Text style={styles.eyebrow}>Your cargo</Text><SectionHeader title="Shipments" /><Text style={styles.description}>Every package, one calm view.</Text></View><IconButton label="Send a package" icon="plus" onPress={() => router.push("/send" as Href)} /></View><FlatList data={displayedShipments} keyExtractor={(shipment) => shipment.id} contentContainerStyle={styles.list} showsVerticalScrollIndicator={false} renderItem={({ item }) => <ShipmentCard shipment={item} onPress={() => router.push(`/shipments/${item.id}` as Href)} />} ListHeaderComponent={<View style={styles.listHeader}><View style={styles.searchFrame}><AppIcon name="magnify" size={21} color={nwcColors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Search tracking number or destination" placeholderTextColor="#91A0AE" style={styles.searchInput} returnKeyType="search" accessibilityLabel="Search shipments" /></View><View style={styles.filterRail}>{(["all", "active", "delivered"] as const).map((option) => <TouchableOpacity key={option} accessibilityRole="tab" accessibilityState={{ selected: filter === option }} accessibilityLabel={`Show ${option} shipments`} onPress={() => setFilter(option)} style={[styles.filterChip, filter === option && styles.filterChipSelected]}><Text style={[styles.filterText, filter === option && styles.filterTextSelected]}>{option === "all" ? "All" : option === "active" ? "Active" : "Delivered"}</Text></TouchableOpacity>)}{(filter !== "all" || query) ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear shipment search and filters" onPress={resetFilters} style={styles.resetButton}><AppIcon name="refresh" size={18} color={nwcColors.brandNavy} /></TouchableOpacity> : null}</View><View style={styles.listCaption}><Text style={styles.listCaptionText}>{displayedShipments.length === 1 ? "1 shipment" : `${displayedShipments.length} shipments`}</Text><View style={styles.mockIndicator}><View style={styles.mockDot} /><Text style={styles.mockText}>Mock updates</Text></View></View></View>} ListEmptyComponent={<View style={styles.emptyState}><View style={styles.emptyIcon}><AppIcon name="package-variant-closed-remove" size={26} color={nwcColors.info} /></View><Text style={styles.emptyTitle}>No shipments match this search</Text><Text style={styles.emptyDetail}>Try a tracking number, destination, or another shipment filter.</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset shipment search and filters" onPress={resetFilters} style={styles.emptyReset}><Text style={styles.emptyResetText}>Clear search</Text></TouchableOpacity></View>} /></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 20 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  headerCopy: { flex: 1 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 2 },
  description: { color: nwcColors.muted, fontSize: 14, lineHeight: 20, fontFamily: "Poppins_500Medium", marginTop: -7 },
  list: { paddingTop: 19, paddingBottom: 130, gap: 12 },
  listHeader: { gap: 13, marginBottom: 7 },
  searchFrame: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 14, borderWidth: 1, borderColor: nwcColors.border, borderRadius: 17, backgroundColor: nwcColors.surface },
  searchInput: { flex: 1, minHeight: 52, paddingVertical: 0, color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_600SemiBold" },
  filterRail: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#EAF1F4", padding: 4, borderRadius: 15 },
  filterChip: { minHeight: 34, paddingHorizontal: 13, justifyContent: "center", alignItems: "center", borderRadius: 11 },
  filterChipSelected: { backgroundColor: nwcColors.surface },
  filterText: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_700Bold" },
  filterTextSelected: { color: nwcColors.brandNavy },
  resetButton: { width: 35, height: 34, marginLeft: "auto", borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  listCaption: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 2, marginTop: 1 },
  listCaptionText: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_700Bold" },
  mockIndicator: { flexDirection: "row", alignItems: "center", gap: 5 },
  mockDot: { height: 6, width: 6, borderRadius: 3, backgroundColor: nwcColors.primary },
  mockText: { color: nwcColors.muted, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_600SemiBold" },
  emptyState: { alignItems: "center", paddingTop: 28, paddingHorizontal: 28, gap: 8 },
  emptyIcon: { height: 58, width: 58, borderRadius: 20, backgroundColor: "#EAF4F8", alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: nwcColors.foreground, fontSize: 17, lineHeight: 23, fontFamily: "Poppins_800ExtraBold", textAlign: "center", marginTop: 4 },
  emptyDetail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium", textAlign: "center" },
  emptyReset: { minHeight: 40, paddingHorizontal: 14, borderRadius: 12, backgroundColor: nwcColors.primary, alignItems: "center", justifyContent: "center", marginTop: 4 },
  emptyResetText: { color: nwcColors.primaryInk, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
});
