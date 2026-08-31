import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { BookingScreen, BookingSection, FormField } from "@/components/booking/booking-ui";
import { AppIcon } from "@/components/ui/app-icon";
import { Card } from "@/components/ui/nwc-ui";
import { savedPlaces } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";
import { useBookingDraft } from "@/stores/booking-draft";
import type { Address } from "@/types/cargo";
import { isRouteReady } from "@/lib/booking-progress";

export default function LocalDeliveryRouteScreen() {
  const { localDraft, updateLocalDraft, setBookingStep } = useBookingDraft();
  const updateAddress = (key: "pickup" | "destination", detail: string) => {
    const current = localDraft[key] ?? { city: "Lusaka", area: "" };
    updateLocalDraft({ [key]: { ...current, detail } });
  };
  const applySaved = (place: Address, key: "pickup" | "destination") => updateLocalDraft({ [key]: place });
  const continueBooking = () => { setBookingStep("parcel"); router.push("/local-delivery/parcel" as Href); };
  return <BookingScreen activeStep="route" title="Where should we pick up and deliver?" detail="Enter the key place details. You can refine a pin or landmark when maps are connected." continueLabel="Continue to parcel" onContinue={continueBooking} continueDisabled={!isRouteReady(localDraft)}><BookingSection label="Pickup"><FormField label="From where?" icon="circle-outline" placeholder="Building, street, area, or landmark" value={localDraft.pickup?.detail ?? ""} onChangeText={(detail) => updateAddress("pickup", detail)} /><FormField label="Pickup area" icon="map-marker-outline" placeholder="e.g. Longacres, Lusaka" value={localDraft.pickup?.area ?? ""} onChangeText={(area) => updateLocalDraft({ pickup: { city: "Lusaka", detail: localDraft.pickup?.detail ?? "", area } })} /></BookingSection><BookingSection label="Destination"><FormField label="To where?" icon="map-marker" placeholder="Building, street, area, or landmark" value={localDraft.destination?.detail ?? ""} onChangeText={(detail) => updateAddress("destination", detail)} /><FormField label="Delivery area" icon="map-marker-outline" placeholder="e.g. Roma, Lusaka" value={localDraft.destination?.area ?? ""} onChangeText={(area) => updateLocalDraft({ destination: { city: "Lusaka", detail: localDraft.destination?.detail ?? "", area } })} /></BookingSection><TouchableOpacity accessibilityRole="button" accessibilityLabel="Search places and route" accessibilityHint="Choose pickup and delivery locations from an accessible mock map" onPress={() => router.push("/address-search" as Href)} style={styles.mapSearch}><View style={styles.mapSearchIcon}><AppIcon name="map-search-outline" size={21} color={nwcColors.primaryInk} /></View><View style={styles.mapSearchCopy}><Text style={styles.mapSearchTitle}>Search places and preview route</Text><Text style={styles.mapSearchDetail}>Use address results, branches, warehouses, and a text route alternative.</Text></View><AppIcon name="chevron-right" size={22} color={nwcColors.brandNavy} /></TouchableOpacity><BookingSection label="Saved places"><Card style={styles.savedCard}>{savedPlaces.map((place) => <View key={place.label} style={styles.savedRow}><View style={styles.savedCopy}><View style={styles.savedTitleRow}><AppIcon name={place.label === "Home" ? "home-variant-outline" : place.label === "Work" ? "briefcase-outline" : "storefront-outline"} size={17} color={nwcColors.brandNavy} /><Text style={styles.savedTitle}>{place.label}</Text></View><Text style={styles.savedDetail}>{`${place.area}, ${place.city}`}</Text></View><View style={styles.savedButtons}><TouchableOpacity accessibilityRole="button" accessibilityLabel={`Use ${place.label} as pickup`} onPress={() => applySaved(place, "pickup")} style={styles.savedButton}><Text style={styles.savedButtonText}>From</Text></TouchableOpacity><TouchableOpacity accessibilityRole="button" accessibilityLabel={`Use ${place.label} as destination`} onPress={() => applySaved(place, "destination")} style={styles.savedButton}><Text style={styles.savedButtonText}>To</Text></TouchableOpacity></View></View>)}</Card></BookingSection></BookingScreen>;
}

const styles = StyleSheet.create({
  savedCard: { paddingVertical: 4 },
  savedRow: { paddingVertical: 12, flexDirection: "row", alignItems: "center", gap: 8, borderBottomWidth: 1, borderBottomColor: nwcColors.border },
  savedCopy: { flex: 1, gap: 3 },
  savedTitleRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  savedTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontWeight: "800" },
  savedDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontWeight: "600" },
  savedButtons: { flexDirection: "row", gap: 4 },
  savedButton: { minHeight: 34, minWidth: 40, alignItems: "center", justifyContent: "center", borderRadius: 10, backgroundColor: "#EAF1F4", paddingHorizontal: 7 },
  savedButtonText: { color: nwcColors.brandNavy, fontSize: 12, lineHeight: 16, fontWeight: "800" },
  mapSearch: { minHeight: 82, borderWidth: 1, borderColor: nwcColors.brandNavy, borderRadius: 18, backgroundColor: "#F2F8FA", padding: 13, flexDirection: "row", alignItems: "center", gap: 11 },
  mapSearchIcon: { height: 42, width: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  mapSearchCopy: { flex: 1, gap: 2 },
  mapSearchTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontWeight: "800" },
  mapSearchDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontWeight: "500" },
});
