import { router } from "expo-router";
import { View } from "react-native";
import { BookingScreen, SummaryRow } from "@/components/booking/booking-ui";
import { importSteps, isImportReady } from "@/lib/service-booking";
import { useBookingDraft } from "@/stores/booking-draft";

export default function ImportReviewScreen() { const { importDraft } = useBookingDraft(); return <BookingScreen activeStep="review" serviceLabel="International Imports" progressSteps={importSteps} title="Review your import" detail="This starts an import request. Your final quote is confirmed after review." continueLabel="Request import quote" continueDisabled={!isImportReady(importDraft)} onContinue={() => router.replace("/import/confirmation" as never)}><View><SummaryRow label="Method" value={importDraft.method === "air" ? "Air Freight" : "Sea Freight"} /><SummaryRow label="Route" value={`${importDraft.originCity ?? "Origin"}, ${importDraft.originCountry ?? ""} → ${importDraft.destinationCity ?? "Destination"}`} /><SummaryRow label="Cargo" value={importDraft.cargoCategory ?? "Not selected"} /><SummaryRow label="Consignee" value={importDraft.consignee?.name ?? "Not provided"} /></View></BookingScreen>; }
