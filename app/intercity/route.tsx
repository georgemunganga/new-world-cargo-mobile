import { router } from "expo-router";
import { BookingScreen } from "@/components/booking/booking-ui";
import { RouteEntryCard } from "@/components/booking/route-entry-card";
import { intercitySteps } from "@/lib/service-booking";
import { useBookingDraft } from "@/stores/booking-draft";

export default function IntercityRouteScreen() { const { intercityDraft, updateIntercityDraft } = useBookingDraft(); const ready = Boolean(intercityDraft.originCity && intercityDraft.destinationCity); return <BookingScreen activeStep="route" serviceLabel="City-to-City" progressSteps={intercitySteps} title="Which cities are you connecting?" detail="Search your pickup and destination city directly below." continueLabel="Continue to cargo" continueDisabled={!ready} onContinue={() => router.push("/intercity/cargo" as never)}><RouteEntryCard scope="intercity" from={{ value: intercityDraft.originCity ?? "", detail: "Origin city" }} to={{ value: intercityDraft.destinationCity ?? "", detail: "Destination city" }} onSuggestionSelect={(target, suggestion) => target === "from" ? updateIntercityDraft({ originCity: suggestion.city }) : updateIntercityDraft({ destinationCity: suggestion.city })} accessibilityHint="Set your City-to-City pickup and destination" /></BookingScreen>; }
