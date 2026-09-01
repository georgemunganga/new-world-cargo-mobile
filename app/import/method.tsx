import { router } from "expo-router";
import { BookingScreen, BookingSection, ChoiceTile } from "@/components/booking/booking-ui";
import { importSteps } from "@/lib/service-booking";
import { useBookingDraft } from "@/stores/booking-draft";

export default function ImportMethodScreen() { const { importDraft, updateImportDraft } = useBookingDraft(); return <BookingScreen activeStep="method" serviceLabel="International Imports" progressSteps={importSteps} title="How should your cargo travel?" detail="Choose the option that suits your timing and shipment volume." continueLabel="Continue to route" continueDisabled={!importDraft.method} onContinue={() => router.push("/import/route" as never)}><BookingSection><ChoiceTile title="Air Freight" detail="Faster for time-sensitive cargo." icon="airplane" selected={importDraft.method === "air"} onPress={() => updateImportDraft({ method: "air" })} /><ChoiceTile title="Sea Freight" detail="Best for larger or flexible shipments." icon="ferry" selected={importDraft.method === "sea"} onPress={() => updateImportDraft({ method: "sea" })} /></BookingSection></BookingScreen>; }
