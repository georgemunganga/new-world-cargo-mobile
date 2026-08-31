import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { MockRouteMap } from "@/components/map/mock-route-map";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, PrimaryButton, Screen, SectionHeader, StatusBadge } from "@/components/ui/nwc-ui";
import { searchMockAddresses, type AddressSearchResult } from "@/lib/mock-addresses";
import { nwcColors } from "@/lib/nwc-theme";
import { useBookingDraft } from "@/stores/booking-draft";
import { useMockPermissions } from "@/stores/mock-permissions";

type PlaceTarget = "pickup" | "destination";

export default function AddressSearchScreen() {
  const [target, setTarget] = useState<PlaceTarget>("pickup");
  const [query, setQuery] = useState("");
  const { localDraft, updateLocalDraft } = useBookingDraft();
  const { statuses } = useMockPermissions();
  const results = useMemo(() => searchMockAddresses(query), [query]);
  const selectAddress = (address: AddressSearchResult) => {
    updateLocalDraft({ [target]: { label: address.label, city: address.city, area: address.area, detail: address.detail } });
    if (target === "pickup") setTarget("destination");
  };
  const isComplete = Boolean(localDraft.pickup && localDraft.destination);
  return <Screen><View style={styles.page}><View style={styles.header}><View><Text style={styles.eyebrow}>Local Delivery</Text><SectionHeader title="Find an address" /></View><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /></View><ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.targetSwitch}><TargetButton label="Pickup" selected={target === "pickup"} onPress={() => setTarget("pickup")} /><TargetButton label="Delivery" selected={target === "destination"} onPress={() => setTarget("destination")} /></View><View style={styles.searchFrame}><AppIcon name="magnify" size={22} color={nwcColors.muted} /><TextInput value={query} onChangeText={setQuery} placeholder={`Search ${target === "pickup" ? "pickup" : "delivery"} area, road, branch, or landmark`} placeholderTextColor="#91A0AE" style={styles.searchInput} returnKeyType="search" /></View><TouchableOpacity accessibilityRole="button" accessibilityLabel="Use my current location" accessibilityHint="Opens location permission education when access is not allowed" onPress={() => statuses.location === "granted" ? setQuery("Longacres") : router.push("/permissions/location" as Href)} style={styles.locationButton}><AppIcon name="crosshairs-gps" size={19} color={nwcColors.info} /><Text style={styles.locationText}>{statuses.location === "granted" ? "Use current location in preview" : "Use my current location"}</Text><AppIcon name="chevron-right" size={20} color={nwcColors.info} /></TouchableOpacity><View style={styles.locationWarning}><AppIcon name="information-outline" size={18} color={nwcColors.warning} /><Text style={styles.locationWarningText}>Map pins are approximate in this mock frontend. Confirm the written address and landmark before requesting pickup.</Text></View><Text style={styles.resultHeading}>{query ? "Search results" : "Suggested places"}</Text><View style={styles.results}>{results.map((address) => <AddressResultCard key={address.id} address={address} onPress={() => selectAddress(address)} />)}{results.length === 0 ? <Card style={styles.noResults}><AppIcon name="map-search-outline" size={26} color={nwcColors.info} /><Text style={styles.noResultsTitle}>No matching place yet</Text><Text style={styles.noResultsDetail}>Try a city, area, road, landmark, branch, or warehouse. You can also type the address manually on the booking route screen.</Text></Card> : null}</View>{isComplete ? <View style={styles.preview}><Text style={styles.previewTitle}>Route preview</Text><MockRouteMap pickup={localDraft.pickup} destination={localDraft.destination} /><View style={styles.serviceArea}><AppIcon name="map-marker-radius-outline" size={19} color={nwcColors.success} /><Text style={styles.serviceAreaText}>The mock route stays within the Lusaka local-delivery service area. Live availability will be confirmed before booking.</Text></View><PrimaryButton label="Use this route" icon="check" onPress={() => router.back()} /></View> : null}<Card style={styles.markersCard}><Text style={styles.markersTitle}>Collection markers in your search</Text><View style={styles.markerRow}><AppIcon name="storefront-outline" size={19} color={nwcColors.brandNavy} /><Text style={styles.markerText}>New WorldCargo branch and warehouse results are marked clearly for collection or receiving.</Text></View></Card></ScrollView></View></Screen>;
}

function TargetButton({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="tab" accessibilityState={{ selected }} accessibilityLabel={`Select ${label.toLowerCase()} address`} onPress={onPress} style={[styles.targetButton, selected && styles.targetButtonSelected]}><Text style={[styles.targetText, selected && styles.targetTextSelected]}>{label}</Text></TouchableOpacity>;
}

function AddressResultCard({ address, onPress }: { address: AddressSearchResult; onPress: () => void }) {
  const icon = address.type === "branch" ? "storefront-outline" : address.type === "warehouse" ? "warehouse" : "map-marker-outline";
  const label = address.type === "branch" ? "Branch" : address.type === "warehouse" ? "Warehouse" : "Address";
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Choose ${address.label}`} accessibilityHint={`${address.detail}. ${address.landmark}`} onPress={onPress} activeOpacity={0.76}><Card style={styles.resultCard}><View style={styles.resultIcon}><AppIcon name={icon} size={21} color={nwcColors.brandNavy} /></View><View style={styles.resultCopy}><Text style={styles.resultTitle}>{address.label}</Text><Text style={styles.resultDetail}>{`${address.detail}, ${address.city}`}</Text><Text style={styles.resultLandmark}>{address.landmark}</Text></View><StatusBadge label={label} tone={address.type === "address" ? "neutral" : "info"} /></Card></TouchableOpacity>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 16 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 2 },
  content: { paddingTop: 14, paddingBottom: 30, gap: 13 },
  targetSwitch: { flexDirection: "row", gap: 8, backgroundColor: "#EAF1F4", padding: 4, borderRadius: 14 },
  targetButton: { flex: 1, minHeight: 40, justifyContent: "center", alignItems: "center", borderRadius: 11 },
  targetButtonSelected: { backgroundColor: nwcColors.surface },
  targetText: { color: nwcColors.muted, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_700Bold" },
  targetTextSelected: { color: nwcColors.brandNavy },
  searchFrame: { minHeight: 56, flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, borderWidth: 1, borderColor: nwcColors.border, borderRadius: 16, backgroundColor: nwcColors.surface },
  searchInput: { flex: 1, minHeight: 54, color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_600SemiBold", paddingVertical: 0 },
  locationButton: { minHeight: 50, paddingHorizontal: 14, borderRadius: 16, flexDirection: "row", alignItems: "center", gap: 9, backgroundColor: "#EAF4F8" },
  locationText: { flex: 1, color: nwcColors.info, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  locationWarning: { flexDirection: "row", alignItems: "flex-start", gap: 8, paddingHorizontal: 2 },
  locationWarningText: { flex: 1, color: nwcColors.warning, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_600SemiBold" },
  resultHeading: { color: nwcColors.foreground, fontSize: 16, lineHeight: 22, fontFamily: "Poppins_800ExtraBold", marginTop: 4 },
  results: { gap: 9 },
  resultCard: { minHeight: 92, flexDirection: "row", alignItems: "center", gap: 11 },
  resultIcon: { height: 44, width: 44, borderRadius: 14, justifyContent: "center", alignItems: "center", backgroundColor: "#EAF1F4" },
  resultCopy: { flex: 1, gap: 1 },
  resultTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  resultDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_600SemiBold" },
  resultLandmark: { color: nwcColors.info, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_600SemiBold", marginTop: 1 },
  noResults: { alignItems: "center", paddingVertical: 24, gap: 8 },
  noResultsTitle: { color: nwcColors.foreground, fontSize: 16, lineHeight: 21, fontFamily: "Poppins_800ExtraBold" },
  noResultsDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium", textAlign: "center" },
  preview: { gap: 12, marginTop: 5 },
  previewTitle: { color: nwcColors.foreground, fontSize: 16, lineHeight: 22, fontFamily: "Poppins_800ExtraBold" },
  serviceArea: { flexDirection: "row", alignItems: "flex-start", gap: 8, padding: 13, borderRadius: 15, backgroundColor: "#E5F4EE" },
  serviceAreaText: { flex: 1, color: nwcColors.success, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_600SemiBold" },
  markersCard: { gap: 8, backgroundColor: "#F4F7F8" },
  markersTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  markerRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  markerText: { flex: 1, color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
});
