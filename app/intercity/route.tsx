import { router } from "expo-router";
import { BookingMapRouteShell } from "@/components/booking/booking-map-route-shell";
import { RouteEntryCard } from "@/components/booking/route-entry-card";
import { intercitySteps } from "@/lib/service-booking";
import { useBookingDraft } from "@/stores/booking-draft";
import type { Address } from "@/types/cargo";

function cityAddress(city?: string, branchId?: string, fallback = "", latitude?: number, longitude?: number): Address | undefined {
  if (!city) return undefined;
  return { city, area: city, detail: city, label: fallback || city, branchId, latitude, longitude };
}

export default function IntercityRouteScreen() { const { intercityDraft, updateIntercityDraft } = useBookingDraft(); const ready = Boolean(intercityDraft.originCity && intercityDraft.destinationCity); return <BookingMapRouteShell service="intercity" activeStep="route" serviceLabel="City-to-City" progressSteps={intercitySteps} title="Which cities are you connecting?" detail="Pick a served city or New WorldCargo branch. The map pins move as soon as you choose a suggestion." pickup={cityAddress(intercityDraft.originCity, intercityDraft.originBranchId, "Origin city", intercityDraft.originLatitude, intercityDraft.originLongitude)} destination={cityAddress(intercityDraft.destinationCity, intercityDraft.destinationBranchId, "Destination city", intercityDraft.destinationLatitude, intercityDraft.destinationLongitude)} routeReady={ready} continueLabel="Continue to cargo" continueDisabled={!ready} onContinue={() => router.push("/intercity/cargo" as never)}><RouteEntryCard scope="intercity" from={{ value: intercityDraft.originCity ?? "", detail: intercityDraft.originBranchId ? "Selected branch" : "Origin city" }} to={{ value: intercityDraft.destinationCity ?? "", detail: intercityDraft.destinationBranchId ? "Selected branch" : "Destination city" }} onSuggestionSelect={(target, suggestion) => target === "from" ? updateIntercityDraft({ originCity: suggestion.city, originBranchId: suggestion.branchId, originLatitude: suggestion.latitude, originLongitude: suggestion.longitude }) : updateIntercityDraft({ destinationCity: suggestion.city, destinationBranchId: suggestion.branchId, destinationLatitude: suggestion.latitude, destinationLongitude: suggestion.longitude })} accessibilityHint="Set your City-to-City pickup and destination" /></BookingMapRouteShell>; }
