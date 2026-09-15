import { LocalLocationPicker } from "@/components/map/local-location-picker";
import { isInLocalCity, type LocalCity } from "@/lib/maps/local-city";
import { locationService } from "@/lib/services/device/location-service";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
  useWindowDimensions,
} from "react-native";
import { router, type Href } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { RouteEntryCard } from "@/components/booking/route-entry-card";
import {
  LocalDeliveryMapBackdrop,

} from "@/components/map/local-delivery-map-backdrop";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton, PrimaryButton, Screen } from "@/components/ui/nwc-ui";
import { useAppToast } from "@/components/ui/app-toast";
import { isRouteReady } from "@/lib/booking-progress";
import { estimateBookingQuote } from "@/lib/booking-pricing";
import {
  getLocalDeliveryRouteSheetState,
  type LocalDeliveryRouteTarget,
} from "@/lib/local-delivery-route-sheet";
import { useBookingDrawerSnap } from "@/lib/use-cases/use-booking-drawer-snap";
import { savedPlaceToAddress } from "@/lib/account-directory-booking";
import { nwcColors } from "@/lib/nwc-theme";
import { routeSuggestionToAddress } from "@/lib/route-autocomplete";
import { useBookingDraft } from "@/stores/booking-draft";
import { useAddressBook } from "@/lib/use-cases/use-address-book";
import type { BookingQuote, LocalDeliveryVehicle } from "@/types/cargo";

export default function LocalDeliveryRouteScreen() {
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const { localDraft, updateLocalDraft, setBookingStep } = useBookingDraft();
  const toast = useAppToast();
  const currentDraft = useRef({ localDraft, updateLocalDraft });
  currentDraft.current = { localDraft, updateLocalDraft };
  const { savedPlaces } = useAddressBook();
  const [activeTarget, setActiveTarget] =
    useState<LocalDeliveryRouteTarget | null>(null);

  const [adjustingTarget, setAdjustingTarget] = useState<
    "pickup" | "destination" | null
  >(null);

  const [quoteError, setQuoteError] = useState("");
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteRequestVersion, setQuoteRequestVersion] = useState(0);
  const [localCity, setLocalCity] = useState<LocalCity>();
  const [locationVersion, setLocationVersion] = useState(0);
  const [locating, setLocating] = useState(true);
  const [locationError, setLocationError] = useState("");
  useEffect(() => {
    let active = true;
    setLocating(true);
    setLocationError("");
    const timeout = setTimeout(() => {
      active = false;
      setLocating(false);
      setLocationError("Location is taking too long. Check GPS and try again.");
    }, 20000);
    void locationService.getCurrentAddress().then((address) => {
      if (!active) return;
      setLocalCity({ city: address.city, cityDistrict: address.cityDistrict, latitude: address.latitude, longitude: address.longitude });
      const { localDraft: draft, updateLocalDraft: update } = currentDraft.current;
      if (!draft.pickup) update({ pickup: address, quote: undefined });
    }).catch((error) => {
      if (active) setLocationError(error instanceof Error ? error.message : "Unable to find your location. Please try again.");
    }).finally(() => {
      clearTimeout(timeout);
      if (active) setLocating(false);
    });
    return () => { active = false; clearTimeout(timeout); };
  }, [locationVersion]);
  const routeReady = !locating && !locationError && isRouteReady(localDraft) && [localDraft.pickup, localDraft.destination].every((point) => isInLocalCity(point, localCity));
  const vehicle = localDraft.vehicle ?? "scooter";
  const quote = localDraft.quote ?? null;
  const sheetState = getLocalDeliveryRouteSheetState(
    activeTarget,
    height - insets.top,
    Boolean(adjustingTarget),
  );
  const {
    expanded,
    setExpanded,
    sheetHeight,
    drawerTransform,
    panHandlers,
    toggleExpanded,
  } = useBookingDrawerSnap(height, insets.top, sheetState.height);
  useEffect(() => {
    if (
      Platform.OS === "android" &&
      UIManager.setLayoutAnimationEnabledExperimental
    )
      UIManager.setLayoutAnimationEnabledExperimental(true);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
  }, [sheetHeight]);
  useEffect(() => {
    let active = true;
    const { localDraft, updateLocalDraft } = currentDraft.current;
    if (!routeReady) {
      setQuoteError("");
      setQuoteLoading(false);
      if (localDraft.quote) updateLocalDraft({ quote: undefined });
      return () => {
        active = false;
      };
    }
    setQuoteError("");
    setQuoteLoading(true);
    updateLocalDraft({ quote: undefined });
    void estimateBookingQuote("local", localDraft)
      .then((nextQuote) => {
        if (active && nextQuote) updateLocalDraft({ quote: nextQuote });
      })
      .catch((error) => {
        if (!active) return;
        updateLocalDraft({ quote: undefined });
        const message = error instanceof Error
          ? error.message
          : "We could not load a server quote. Check your connection and try again.";
        setQuoteError(message);
        toast.error(message);
      })
      .finally(() => {
        if (active) setQuoteLoading(false);
      });
    return () => {
      active = false;
    };
  }, [
    routeReady,
    vehicle,
    localDraft.pickup?.latitude,
    localDraft.pickup?.longitude,
    localDraft.pickup?.area,
    localDraft.destination?.latitude,
    localDraft.destination?.longitude,
    localDraft.destination?.area,
    quoteRequestVersion,
    toast,
  ]);
  const applySaved = (
    place: (typeof savedPlaces)[number],
    key: "pickup" | "destination",
  ) => {
    const address = savedPlaceToAddress(place);
    if (!isInLocalCity(address, localCity)) { toast.error(localCity ? `Choose a saved place within ${localCity.city}.` : "Enable location to identify your city first."); return; }
    updateLocalDraft({ [key]: address, quote: undefined });
  };
  const continueBooking = () => {
    if (quote?.expiresAt && Date.parse(quote.expiresAt) <= Date.now()) { setQuoteRequestVersion((version) => version + 1); toast.info("Refreshing your expired price. Review the updated amount before continuing."); return; }
    setBookingStep("parcel");
    router.push("/local-delivery/parcel" as Href);
  };
  const openPinAdjustment = (target: "pickup" | "destination") => {
    setActiveTarget(null);

    if (!localCity) { toast.error("Enable location to identify your city first."); return; }
    setAdjustingTarget(target);
    setExpanded(false);
  };
  const isEditing = Boolean(activeTarget);
  const sheetTitle = isEditing
    ? "Where should we look?"
    : adjustingTarget
      ? `Adjust ${adjustingTarget} pin`
      : "Set your route";
  const sheetDetail =
    locationError || (locating ? "Finding your location..." : "") ||
    (localCity && [localDraft.pickup, localDraft.destination].some((point) => point && !isInLocalCity(point, localCity)) ? `Select map locations within ${localCity.city} for pickup and delivery.` : "") || quoteError ||
    (isEditing
      ? "Search in your city or choose a location on the map."
      : adjustingTarget
        ? "Use the controls to nudge the map pin, then confirm its position."
        : localCity ? `Pickup and delivery within ${localCity.city}.` : "Enable location to start your local delivery.");

  return (
    <Screen>
      {adjustingTarget && localCity ? <LocalLocationPicker city={localCity} target={adjustingTarget} initial={localDraft[adjustingTarget]} onClose={() => setAdjustingTarget(null)} onConfirm={(address) => { updateLocalDraft({ [adjustingTarget]: address, quote: undefined }); setAdjustingTarget(null); }} /> : null}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.page}
      >
        <LocalDeliveryMapBackdrop
          pickup={localDraft.pickup}
          destination={localDraft.destination}

          adjustingTarget={adjustingTarget}
          routeReady={routeReady}
        />
        <View style={styles.topBar}>
          <IconButton
            label="Go back"
            icon="arrow-left"
            onPress={() => router.back()}
          />
          <View style={styles.topPill}>
            <View style={styles.topPillDot} />
            <Text style={styles.topPillText}>Local Delivery</Text>
          </View>
          <View style={{ width: 44 }} />
        </View>
        <View style={[styles.sheet, { height: sheetHeight }, drawerTransform]}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`${expanded ? "Collapse" : "Expand"} local delivery drawer`}
            accessibilityHint="You can also drag this handle"
            onPress={toggleExpanded}
            {...panHandlers}
            style={styles.handleArea}
          >
            <View style={styles.grabber} />
          </TouchableOpacity>
          <ScrollView
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.sheetContent,
              { paddingBottom: Math.max(insets.bottom, 18) + 10 },
            ]}
          >
            <View>
              <Text style={styles.title}>{sheetTitle}</Text>
              <Text style={styles.detail}>{sheetDetail}</Text>
            </View>
            {<>
                {locationError ? <PrimaryButton label="Retry current location" icon="crosshairs-gps" loading={locating} onPress={() => setLocationVersion((v) => v + 1)} /> : null}
                <RouteEntryCard
                  scope="local"
                  localCity={localCity}
                  from={{
                    value: localDraft.pickup?.detail ?? "",
                    detail: localDraft.pickup?.area ?? "",
                  }}
                  to={{
                    value: localDraft.destination?.detail ?? "",
                    detail: localDraft.destination?.area ?? "",
                  }}
                  onSuggestionSelect={(target, suggestion) =>
                    updateLocalDraft({
                      [target === "from" ? "pickup" : "destination"]:
                        routeSuggestionToAddress(suggestion),
                    })
                  }
                  onActiveTargetChange={(target) => {
                    setActiveTarget(target);
                    setExpanded(Boolean(target));
                    if (target) setAdjustingTarget(null);
                  }}
                  onManualEntryPress={(target) => openPinAdjustment(target === "from" ? "pickup" : "destination")}
                  manualEntryLabel="Use map"
                  accessibilityHint="Search nearby local pickup and destination locations"
                />
                {isEditing ? null : (
                  <>
                    <RoutePreview
                      quote={quote}
                      vehicle={vehicle}
                      onSelectVehicle={(nextVehicle) =>
                        updateLocalDraft({ vehicle: nextVehicle })
                      }
                      onAdjustPickup={() => openPinAdjustment("pickup")}
                      onAdjustDestination={() =>
                        openPinAdjustment("destination")
                      }
                    />
                    {savedPlaces.length > 0 ? <View style={styles.savedLine}>
                      <Text style={styles.savedTitle}>Saved places</Text>
                      <View style={styles.savedChips}>
                        {savedPlaces.slice(0, 3).map((place) => (
                          <TouchableOpacity
                            key={place.id}
                            accessibilityRole="button"
                            accessibilityLabel={`Use ${place.label} as ${localDraft.pickup ? "destination" : "pickup"}`}
                            onPress={() =>
                              applySaved(
                                place,
                                localDraft.pickup ? "destination" : "pickup",
                              )
                            }
                            style={styles.savedChip}
                          >
                            <Text style={styles.savedChipText}>
                              {place.label}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    </View> : null}
                    <PrimaryButton
                      label={
                        routeReady
                          ? quote
                            ? "Continue to parcel"
                            : quoteError
                              ? "Retry price"
                              : "Get price"
                          : "Add pickup and destination"
                      }
                      icon="arrow-right"
                      loading={quoteLoading}
                      disabled={!routeReady || quoteLoading || (!quote && !quoteError)}
                      onPress={quote ? continueBooking : () => setQuoteRequestVersion((version) => version + 1)}
                    />
                  </>
                )}
              </>}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

function RoutePreview({
  quote,
  vehicle,
  onSelectVehicle,
  onAdjustPickup,
  onAdjustDestination,
}: {
  quote: BookingQuote | null;
  vehicle: LocalDeliveryVehicle;
  onSelectVehicle: (vehicle: LocalDeliveryVehicle) => void;
  onAdjustPickup: () => void;
  onAdjustDestination: () => void;
}) {
  if (!quote) return null;
  const distance = quote.distanceKm
    ? `${quote.distanceKm} km`
    : "Distance pending";
  const eta = quote.estimatedDurationMinutes
    ? `${quote.estimatedDurationMinutes} min`
    : quote.source === "server"
      ? "Server quote"
      : "Dev fallback";
  return (
    <View style={styles.routePreview}>
      <View style={styles.routePreviewTop}>
        <View style={styles.quoteIcon}>
          <AppIcon name="bike-fast" size={20} color={nwcColors.primaryInk} />
        </View>
        <View style={styles.quoteCopy}>
          <Text style={styles.quoteLabel}>Local delivery estimate</Text>
          <Text style={styles.quoteMeta}>
            {distance} · {eta}
          </Text>
        </View>
        <Text style={styles.quotePrice}>{quote.formattedTotal}</Text>
      </View>
      <View style={styles.vehicleChoices}>
        {(["scooter", "small_van", "cargo_van"] as LocalDeliveryVehicle[]).map(
          (choice) => (
            <TouchableOpacity
              key={choice}
              accessibilityRole="button"
              accessibilityState={{ selected: vehicle === choice }}
              accessibilityLabel={`Choose ${vehicleLabels[choice]}`}
              onPress={() => onSelectVehicle(choice)}
              style={[
                styles.vehicleChoice,
                vehicle === choice && styles.vehicleChoiceActive,
              ]}
            >
              <AppIcon
                name={
                  choice === "scooter"
                    ? "bike-fast"
                    : choice === "small_van"
                      ? "van-utility"
                      : "truck-outline"
                }
                size={17}
                color={
                  vehicle === choice ? nwcColors.primaryInk : nwcColors.info
                }
              />
              <Text
                style={[
                  styles.vehicleName,
                  vehicle === choice && styles.vehicleNameActive,
                ]}
              >
                {vehicleLabels[choice]}
              </Text>
            </TouchableOpacity>
          ),
        )}
      </View>
      <Text style={styles.capacityText}>
        {vehicleCapacity[vehicle]}
      </Text>
      <View style={styles.routePreviewFooter}>
        <Text style={styles.quoteArrival}>
          {quote.expiresAt
            ? `Valid until ${new Date(quote.expiresAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
            : "Final price is confirmed by New WorldCargo before payment."}
        </Text>
        <View style={styles.pinLinks}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Adjust pickup pin"
            onPress={onAdjustPickup}
            style={styles.adjustLink}
          >
            <AppIcon name="crosshairs-gps" size={16} color={nwcColors.info} />
            <Text style={styles.adjustLinkText}>Pickup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Adjust destination pin"
            onPress={onAdjustDestination}
            style={styles.adjustLink}
          >
            <AppIcon
              name="map-marker-radius-outline"
              size={16}
              color={nwcColors.info}
            />
            <Text style={styles.adjustLinkText}>Destination</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#EAF0F1" },
  topBar: {
    position: "absolute",
    zIndex: 3,
    top: 14,
    left: 18,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topPill: {
    minHeight: 40,
    paddingHorizontal: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.95)",
  },
  topPillDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: nwcColors.primary,
  },
  topPillText: {
    color: nwcColors.brandNavy,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "Poppins_800ExtraBold",
  },
  sheet: {
    position: "absolute",
    zIndex: 5,
    left: 0,
    right: 0,
    bottom: 0,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: "hidden",
    backgroundColor: nwcColors.background,
    shadowColor: "#012642",
    shadowOffset: { width: 0, height: -7 },
    shadowOpacity: 0.15,
    shadowRadius: 18,
    elevation: 13,
  },
  handleArea: {
    minHeight: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  grabber: {
    alignSelf: "center",
    width: 43,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#C5D1D6",
  },
  sheetContent: { flexGrow: 1, paddingHorizontal: 20, gap: 14 },
  overline: {
    color: nwcColors.info,
    fontSize: 11,
    lineHeight: 15,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    fontFamily: "Poppins_800ExtraBold",
  },
  title: {
    color: nwcColors.foreground,
    fontSize: 25,
    lineHeight: 31,
    fontFamily: "Poppins_800ExtraBold",
    marginTop: 1,
  },
  detail: {
    color: nwcColors.muted,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "Poppins_500Medium",
    marginTop: 2,
  },
  routePreview: {
    gap: 9,
    padding: 13,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#DCE8EC",
    backgroundColor: "#F4F9FA",
  },
  routePreviewTop: { flexDirection: "row", alignItems: "center", gap: 9 },
  quoteIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nwcColors.primary,
  },
  quoteCopy: { flex: 1 },
  quoteLabel: {
    color: nwcColors.foreground,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Poppins_800ExtraBold",
  },
  quoteMeta: {
    color: nwcColors.muted,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Poppins_600SemiBold",
  },
  quotePrice: {
    color: nwcColors.brandNavy,
    fontSize: 19,
    lineHeight: 25,
    fontFamily: "Poppins_800ExtraBold",
  },
  vehicleChoices: { flexDirection: "row", gap: 6 },
  vehicleChoice: {
    flex: 1,
    minHeight: 55,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#DDE7EA",
    backgroundColor: nwcColors.white,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
  },
  vehicleChoiceActive: {
    borderColor: nwcColors.primary,
    backgroundColor: "#FFF3CC",
  },
  vehicleName: {
    color: nwcColors.info,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: "Poppins_800ExtraBold",
  },
  vehicleNameActive: { color: nwcColors.primaryInk },
  capacityText: {
    color: nwcColors.muted,
    fontSize: 11,
    lineHeight: 15,
    fontFamily: "Poppins_600SemiBold",
  },
  routePreviewFooter: {
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: "#E1EAED",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  quoteArrival: {
    flex: 1,
    color: nwcColors.info,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: "Poppins_700Bold",
  },
  pinLinks: { flexDirection: "row", gap: 5 },
  adjustLink: {
    minHeight: 32,
    borderRadius: 10,
    paddingHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 4,
    backgroundColor: nwcColors.white,
  },
  adjustLinkText: {
    color: nwcColors.info,
    fontSize: 11,
    lineHeight: 15,
    fontFamily: "Poppins_800ExtraBold",
  },
  manualToggle: {
    minHeight: 42,
    borderRadius: 14,
    paddingHorizontal: 12,
    backgroundColor: "#EAF4F8",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  manualToggleText: {
    flex: 1,
    color: nwcColors.info,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "Poppins_800ExtraBold",
  },
  manualArea: { gap: 11 },
  savedLine: { gap: 8 },
  savedTitle: {
    color: nwcColors.foreground,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "Poppins_800ExtraBold",
  },
  savedChips: { flexDirection: "row", gap: 7 },
  savedChip: {
    minHeight: 34,
    borderRadius: 12,
    paddingHorizontal: 11,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: nwcColors.surface,
    borderWidth: 1,
    borderColor: nwcColors.border,
  },
  savedChipText: {
    color: nwcColors.brandNavy,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: "Poppins_700Bold",
  },
  pinPanel: { gap: 12 },
  pinHint: {
    minHeight: 43,
    paddingHorizontal: 11,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#EAF4F8",
  },
  pinHintText: {
    flex: 1,
    color: nwcColors.info,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "Poppins_700Bold",
  },
  nudgeGrid: { alignItems: "center", gap: 7 },
  nudgeMiddle: { flexDirection: "row", gap: 7 },
  nudgeButton: {
    width: 43,
    height: 37,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: nwcColors.white,
    borderWidth: 1,
    borderColor: nwcColors.border,
  },
  nudgeButtonActive: {
    borderColor: nwcColors.primary,
    backgroundColor: "#FFF1C5",
  },
});

const vehicleLabels: Record<LocalDeliveryVehicle, string> = {
  scooter: "Bike",
  small_van: "Small van",
  cargo_van: "Cargo van",
};
const vehicleCapacity: Record<LocalDeliveryVehicle, string> = {
  scooter: "Up to 8 kg",
  small_van: "Up to 50 kg",
  cargo_van: "Up to 300 kg",
};




