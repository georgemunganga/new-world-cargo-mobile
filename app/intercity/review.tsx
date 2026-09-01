import { router } from "expo-router";
import { View } from "react-native";
import { BookingScreen, SummaryRow } from "@/components/booking/booking-ui";
import { intercitySteps, isIntercityReady } from "@/lib/service-booking";
import { useBookingDraft } from "@/stores/booking-draft";

export default function IntercityReviewScreen() { const { intercityDraft } = useBookingDraft(); return <BookingScreen activeStep="review" serviceLabel="City-to-City" progressSteps={intercitySteps} title="Review your Katundu" detail="We will confirm your available schedule and final quote before collection." continueLabel="Request a quote" continueDisabled={!isIntercityReady(intercityDraft)} onContinue={() => router.replace("/intercity/confirmation" as never)}><View><SummaryRow label="Route" value={`${intercityDraft.originCity ?? "Origin"} → ${intercityDraft.destinationCity ?? "Destination"}`} /><SummaryRow label="Cargo" value={intercityDraft.cargoCategory ?? "Not selected"} /><SummaryRow label="Collection" value={intercityDraft.fulfilment === "door_delivery" ? "Door delivery" : "Collection point"} /><SummaryRow label="Receiver" value={intercityDraft.receiver?.name ?? "Not provided"} /></View></BookingScreen>; }
