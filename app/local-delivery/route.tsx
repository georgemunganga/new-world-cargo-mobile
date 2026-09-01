import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from "react-native";
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { router, type Href } from "expo-router";
import { BookingSection, FormField } from "@/components/booking/booking-ui";
import { RouteEntryCard } from "@/components/booking/route-entry-card";
import { LocalDeliveryMapBackdrop } from "@/components/map/local-delivery-map-backdrop";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton, PrimaryButton, Screen } from "@/components/ui/nwc-ui";
import { getLocalDeliveryRouteSheetState, localDeliveryCompactSheetHeight, type LocalDeliveryRouteTarget } from "@/lib/local-delivery-route-sheet";
import { savedPlaces } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";
import { routeSuggestionToAddress } from "@/lib/route-autocomplete";
import { isRouteReady } from "@/lib/booking-progress";
import { useBookingDraft } from "@/stores/booking-draft";
import type { Address } from "@/types/cargo";

export default function LocalDeliveryRouteScreen() {
  const { height } = useWindowDimensions();
  const { localDraft, updateLocalDraft, setBookingStep } = useBookingDraft();
  const [activeTarget, setActiveTarget] = useState<LocalDeliveryRouteTarget | null>(null);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const sheetState = getLocalDeliveryRouteSheetState(activeTarget, height);
  const sheetHeight = useSharedValue(localDeliveryCompactSheetHeight);
  useEffect(() => { sheetHeight.value = withTiming(sheetState.height, { duration: 240, easing: Easing.out(Easing.cubic) }); }, [sheetHeight, sheetState.height]);
  const sheetStyle = useAnimatedStyle(() => ({ height: sheetHeight.value }));
  const updateAddress = (key: "pickup" | "destination", detail: string) => { const current = localDraft[key] ?? { city: "Lusaka", area: "" }; updateLocalDraft({ [key]: { ...current, detail } }); };
  const applySaved = (place: Address, key: "pickup" | "destination") => updateLocalDraft({ [key]: place });
  const continueBooking = () => { setBookingStep("parcel"); router.push("/local-delivery/parcel" as Href); };
  const isEditing = Boolean(activeTarget);
  return <Screen><View style={styles.page}><LocalDeliveryMapBackdrop pickup={localDraft.pickup} destination={localDraft.destination} /><View style={styles.topBar}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><View style={styles.topPill}><View style={styles.topPillDot} /><Text style={styles.topPillText}>Local Delivery</Text></View><IconButton label="Open notifications" icon="bell-outline" onPress={() => router.push("/notifications" as Href)} /></View><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.sheetPosition} pointerEvents="box-none"><Animated.View style={[styles.sheet, sheetStyle]}><View style={styles.grabber} /><ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetContent}><View><Text style={styles.overline}>{isEditing ? `Search ${activeTarget === "from" ? "pickup" : "destination"}` : "Local Delivery"}</Text><Text style={styles.title}>{isEditing ? "Where should we look?" : "Set your route"}</Text><Text style={styles.detail}>{isEditing ? "Suggestions will appear below the field you are typing in." : "Choose pickup and destination. We will handle the rest."}</Text></View><RouteEntryCard scope="local" from={{ value: localDraft.pickup?.detail ?? "", detail: localDraft.pickup?.area ?? "" }} to={{ value: localDraft.destination?.detail ?? "", detail: localDraft.destination?.area ?? "" }} onSuggestionSelect={(target, suggestion) => updateLocalDraft({ [target === "from" ? "pickup" : "destination"]: routeSuggestionToAddress(suggestion) })} onActiveTargetChange={setActiveTarget} onManualEntryPress={() => { setActiveTarget(null); setShowManualEntry((current) => !current); }} accessibilityHint="Search nearby local pickup and destination locations" />{isEditing ? null : <><TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: showManualEntry }} accessibilityLabel={showManualEntry ? "Hide manual address entry" : "Enter an address manually"} onPress={() => setShowManualEntry((current) => !current)} style={styles.manualToggle}><AppIcon name="pencil-outline" size={18} color={nwcColors.info} /><Text style={styles.manualToggleText}>{showManualEntry ? "Hide manual address entry" : "Enter address manually"}</Text><AppIcon name={showManualEntry ? "chevron-up" : "chevron-down"} size={19} color={nwcColors.info} /></TouchableOpacity>{showManualEntry ? <View style={styles.manualArea}><BookingSection label="Pickup details"><FormField label="From where?" icon="circle-outline" placeholder="Building, street, area, or landmark" value={localDraft.pickup?.detail ?? ""} onChangeText={(detail) => updateAddress("pickup", detail)} /><FormField label="Pickup area" icon="map-marker-outline" placeholder="e.g. Longacres, Lusaka" value={localDraft.pickup?.area ?? ""} onChangeText={(area) => updateLocalDraft({ pickup: { city: "Lusaka", detail: localDraft.pickup?.detail ?? "", area } })} /></BookingSection><BookingSection label="Delivery details"><FormField label="To where?" icon="map-marker" placeholder="Building, street, area, or landmark" value={localDraft.destination?.detail ?? ""} onChangeText={(detail) => updateAddress("destination", detail)} /><FormField label="Delivery area" icon="map-marker-outline" placeholder="e.g. Roma, Lusaka" value={localDraft.destination?.area ?? ""} onChangeText={(area) => updateLocalDraft({ destination: { city: "Lusaka", detail: localDraft.destination?.detail ?? "", area } })} /></BookingSection></View> : null}<View style={styles.savedLine}><Text style={styles.savedTitle}>Saved places</Text><View style={styles.savedChips}>{savedPlaces.slice(0, 3).map((place) => <TouchableOpacity key={place.label} accessibilityRole="button" accessibilityLabel={`Use ${place.label} as pickup`} onPress={() => applySaved(place, localDraft.pickup ? "destination" : "pickup")} style={styles.savedChip}><Text style={styles.savedChipText}>{place.label}</Text></TouchableOpacity>)}</View></View><PrimaryButton label="Continue to parcel" icon="arrow-right" disabled={!isRouteReady(localDraft)} onPress={continueBooking} /></>}</ScrollView></Animated.View></KeyboardAvoidingView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#EAF0F1" },
  topBar: { position: "absolute", top: 14, left: 18, right: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  topPill: { minHeight: 40, paddingHorizontal: 13, borderRadius: 14, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "rgba(255,255,255,0.95)" },
  topPillDot: { height: 8, width: 8, borderRadius: 4, backgroundColor: nwcColors.primary },
  topPillText: { color: nwcColors.brandNavy, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" },
  sheetPosition: { position: "absolute", left: 0, right: 0, bottom: 0, pointerEvents: "box-none" },
  sheet: { borderTopLeftRadius: 30, borderTopRightRadius: 30, overflow: "hidden", backgroundColor: nwcColors.background, shadowColor: "#012642", shadowOffset: { width: 0, height: -7 }, shadowOpacity: 0.15, shadowRadius: 18, elevation: 13 },
  grabber: { alignSelf: "center", width: 43, height: 5, borderRadius: 3, backgroundColor: "#C5D1D6", marginTop: 10, marginBottom: 7 },
  sheetContent: { paddingHorizontal: 20, paddingBottom: 22, gap: 14 },
  overline: { color: nwcColors.info, fontSize: 11, lineHeight: 15, letterSpacing: 0.8, textTransform: "uppercase", fontFamily: "Poppins_800ExtraBold" },
  title: { color: nwcColors.foreground, fontSize: 25, lineHeight: 31, fontFamily: "Poppins_800ExtraBold", marginTop: 1 },
  detail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium", marginTop: 2 },
  manualToggle: { minHeight: 42, borderRadius: 14, paddingHorizontal: 12, backgroundColor: "#EAF4F8", flexDirection: "row", alignItems: "center", gap: 8 },
  manualToggleText: { flex: 1, color: nwcColors.info, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" },
  manualArea: { gap: 11 },
  savedLine: { gap: 8 },
  savedTitle: { color: nwcColors.foreground, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" },
  savedChips: { flexDirection: "row", gap: 7 },
  savedChip: { minHeight: 34, borderRadius: 12, paddingHorizontal: 11, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.surface, borderWidth: 1, borderColor: nwcColors.border },
  savedChipText: { color: nwcColors.brandNavy, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_700Bold" },
});
