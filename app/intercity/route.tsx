import { router } from "expo-router";
import { BookingScreen, BookingSection, FormField } from "@/components/booking/booking-ui";
import { intercitySteps } from "@/lib/service-booking";
import { useBookingDraft } from "@/stores/booking-draft";

export default function IntercityRouteScreen() { const { intercityDraft, updateIntercityDraft } = useBookingDraft(); return <BookingScreen activeStep="route" serviceLabel="City-to-City" progressSteps={intercitySteps} title="Which cities are you connecting?" detail="Enter the main origin and destination cities for your Katundu." continueLabel="Continue to cargo" continueDisabled={!intercityDraft.originCity || !intercityDraft.destinationCity} onContinue={() => router.push("/intercity/cargo" as never)}><BookingSection><FormField label="From city" icon="map-marker-outline" placeholder="e.g. Lusaka" value={intercityDraft.originCity ?? ""} onChangeText={(originCity) => updateIntercityDraft({ originCity })} /><FormField label="To city" icon="map-marker" placeholder="e.g. Kitwe" value={intercityDraft.destinationCity ?? ""} onChangeText={(destinationCity) => updateIntercityDraft({ destinationCity })} /></BookingSection></BookingScreen>; }
