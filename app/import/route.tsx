import { router } from "expo-router";
import { BookingScreen } from "@/components/booking/booking-ui";
import { RouteEntryCard } from "@/components/booking/route-entry-card";
import { importSteps } from "@/lib/service-booking";
import { useBookingDraft } from "@/stores/booking-draft";

export default function ImportRouteScreen() { const { importDraft, updateImportDraft } = useBookingDraft(); const ready = Boolean(importDraft.originCountry && importDraft.originCity && importDraft.destinationCity); return <BookingScreen activeStep="route" serviceLabel="International Imports" progressSteps={importSteps} title="Where is your cargo moving?" detail="Search a supplier city, port, airport, or receiving city directly below." continueLabel="Continue to cargo" continueDisabled={!ready} onContinue={() => router.push("/import/cargo" as never)}><RouteEntryCard scope="import" from={{ value: importDraft.originCity ?? "", detail: importDraft.originCountry ?? "" }} to={{ value: importDraft.destinationCity ?? "", detail: "Receiving city" }} onSuggestionSelect={(target, suggestion) => target === "from" ? updateImportDraft({ originCountry: suggestion.country ?? importDraft.originCountry, originCity: suggestion.city }) : updateImportDraft({ destinationCity: suggestion.city })} accessibilityHint="Set your import origin and receiving city" /></BookingScreen>; }
