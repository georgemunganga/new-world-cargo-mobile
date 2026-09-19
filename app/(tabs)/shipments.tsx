import { ListSkeleton } from "@/components/ui/skeleton";
import { mobileInputStyles } from "@/components/ui/mobile-input";
import { useMemo, useState } from "react";
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { ShipmentCard } from "@/components/domain/cargo-cards";
import { useFloatingNavigationClearance } from "@/components/navigation/use-floating-navigation-clearance";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton, Screen } from "@/components/ui/nwc-ui";
import { customerSafeMessageFor } from "@/lib/api/errors";
import { toUiShipments } from "@/lib/mappers/shipment-ui-mapper";
import { shipmentDestination } from "@/lib/shipment-navigation";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerShipments } from "@/lib/use-cases/use-customer-shipments";

export default function ShipmentsScreen() {
  const floatingNavigationClearance = useFloatingNavigationClearance();
  const customerShipments = useCustomerShipments();
  const [filter, setFilter] = useState<"all" | "active" | "delivered">("all");
  const [query, setQuery] = useState("");
  const shipments = useMemo(() => toUiShipments(customerShipments.shipments), [customerShipments.shipments]);
  const displayedShipments = useMemo(() => shipments.filter((shipment) => {
    const matchesFilter = filter === "all" || (filter === "active" ? shipment.status !== "delivered" : shipment.status === "delivered");
    const searchable = `${shipment.reference} ${shipment.title} ${shipment.pickup.area} ${shipment.destination.area} ${shipment.destination.city}`.toLowerCase();
    return matchesFilter && searchable.includes(query.trim().toLowerCase());
  }), [filter, query, shipments]);
  const resetFilters = () => { setFilter("all"); setQuery(""); };
  const stateMessage = customerShipments.isStale ? customerShipments.errorMessage : customerShipments.status === "error" ? customerSafeMessageFor(customerShipments.errorMessage) : "";
  return <Screen><View style={styles.page}><View style={styles.header}><View style={styles.headerCopy}><Text style={styles.title}>Shipments</Text><Text style={styles.description}>Every package, one calm view.</Text></View><View style={styles.headerActions}><IconButton label="Track by code" icon="barcode-scan" onPress={() => router.push("/tracking/scan" as Href)} /><IconButton label="Send a package" icon="plus" onPress={() => router.push("/send" as Href)} /></View></View><FlatList refreshing={false} onRefresh={() => void customerShipments.refresh()} data={displayedShipments} keyExtractor={(shipment) => shipment.id} contentContainerStyle={[styles.list, { paddingBottom: floatingNavigationClearance }]} showsVerticalScrollIndicator={false} renderItem={({ item }) => <ShipmentCard shipment={item} onPress={() => router.push(shipmentDestination(item) as Href)} />} ListHeaderComponent={<View style={styles.listHeader}>{stateMessage ? <View style={styles.stateBanner}><Text style={styles.stateBannerText}>{stateMessage}</Text></View> : null}<View style={[styles.searchFrame, mobileInputStyles.frame]}><AppIcon name="magnify" size={21} color={nwcColors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder="Search tracking number or destination" placeholderTextColor="#91A0AE" style={[styles.searchInput, mobileInputStyles.text]} returnKeyType="search" accessibilityLabel="Search shipments" /></View><View accessibilityRole="tablist" style={styles.filterRail}>{(["all", "active", "delivered"] as const).map((option) => <TouchableOpacity key={option} accessibilityRole="tab" accessibilityState={{ selected: filter === option }} accessibilityLabel={`Show ${option} shipments`} onPress={() => setFilter(option)} style={[styles.filterChip, filter === option && styles.filterChipSelected]}><Text style={[styles.filterText, filter === option && styles.filterTextSelected]}>{option === "all" ? "All" : option === "active" ? "Active" : "Delivered"}</Text></TouchableOpacity>)}</View><View style={styles.listCaption}><Text style={styles.listCaptionText}>{displayedShipments.length === 1 ? "1 shipment" : `${displayedShipments.length} shipments`}</Text>{(filter !== "all" || query) ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Clear shipment search and filters" onPress={resetFilters} style={styles.resetButton}><AppIcon name="refresh" size={18} color={nwcColors.brandNavy} /></TouchableOpacity> : null}</View></View>} ListEmptyComponent={customerShipments.status === "loading" ? <ListSkeleton kind="shipment" /> : <View style={styles.emptyState}><View style={styles.emptyIcon}><AppIcon name="package-variant-closed-remove" size={26} color={nwcColors.info} /></View><Text style={styles.emptyTitle}>{customerShipments.status === "empty" ? "No shipments yet" : "No shipments match this search"}</Text><Text style={styles.emptyDetail}>{customerShipments.status === "empty" ? "When you book or receive cargo, it will appear here." : "Try a tracking number, destination, or another shipment filter."}</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel="Reset shipment search and filters" onPress={customerShipments.status === "error" ? customerShipments.refresh : resetFilters} style={styles.emptyReset}><Text style={styles.emptyResetText}>{customerShipments.status === "error" ? "Try again" : "Clear search"}</Text></TouchableOpacity></View>} /></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 20 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }, headerActions: { flexDirection: "row", gap: 7 },
  headerCopy: { flex: 1, gap: 4 },
  title: { color: nwcColors.foreground, fontSize: 30, lineHeight: 38, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.5 },
  description: { color: nwcColors.muted, fontSize: 14, lineHeight: 20, fontFamily: "Poppins_500Medium" },
  list: { paddingTop: 18, gap: 11 },
  listHeader: { gap: 12, marginBottom: 6 },
  stateBanner: { minHeight: 38, borderRadius: 13, paddingHorizontal: 12, justifyContent: "center", backgroundColor: nwcColors.surfaceNavyTint },
  stateBannerText: { color: nwcColors.info, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_700Bold" },
  searchFrame: { minHeight: 54, flexDirection: "row", alignItems: "center", gap: 9, paddingHorizontal: 14, borderWidth: 1, borderColor: "#E2E8EC", borderRadius: 19, backgroundColor: "#F9FBFB" },
  searchInput: { flex: 1, minHeight: 52, paddingVertical: 0, color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_600SemiBold" },
  filterRail: { width: "100%", flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "#EEF3F5", padding: 4, borderRadius: 999 },
  filterChip: { flex: 1, minHeight: 44, paddingVertical: 10, paddingHorizontal: 8, justifyContent: "center", alignItems: "center", borderRadius: 999 },
  filterChipSelected: { backgroundColor: nwcColors.surface },
  filterText: { color: nwcColors.muted, fontSize: 13, lineHeight: 20, fontFamily: "Poppins_700Bold" },
  filterTextSelected: { color: nwcColors.brandNavy },
  resetButton: { width: 44, height: 44, marginLeft: "auto", borderRadius: 999, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  listCaption: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 2, marginTop: 1 },
  listCaptionText: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_700Bold" },
  emptyState: { alignItems: "center", paddingTop: 28, paddingHorizontal: 28, gap: 8 },
  emptyIcon: { height: 58, width: 58, borderRadius: 20, backgroundColor: "#EAF4F8", alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: nwcColors.foreground, fontSize: 17, lineHeight: 23, fontFamily: "Poppins_800ExtraBold", textAlign: "center", marginTop: 4 },
  emptyDetail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium", textAlign: "center" },
  emptyReset: { minHeight: 40, paddingHorizontal: 14, borderRadius: 12, backgroundColor: nwcColors.primary, alignItems: "center", justifyContent: "center", marginTop: 4 },
  emptyResetText: { color: nwcColors.primaryInk, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
});
