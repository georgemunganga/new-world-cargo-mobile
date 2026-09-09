import { useState } from "react";
import { router } from "expo-router";
import { View } from "react-native";

import { BookingQuickEditDrawer } from "@/components/booking/booking-quick-edit-drawer";
import { BookingScreen, SummaryRow } from "@/components/booking/booking-ui";
import { cargoItemsSummary } from "@/lib/booking-cargo";
import { importMethodEditChoices } from "@/lib/booking-review-edits";
import { importSteps, isImportReady } from "@/lib/service-booking";
import { useBookingDraft } from "@/stores/booking-draft";

export default function ImportReviewScreen() { const { importDraft, updateImportDraft } = useBookingDraft(); const [methodEditOpen, setMethodEditOpen] = useState(false); return <BookingScreen activeStep="review" serviceLabel="International Imports" progressSteps={importSteps} title="Review your import" detail="This starts an import request. Your final quote is confirmed after review." continueLabel="Request import quote" continueDisabled={!isImportReady(importDraft)} onContinue={() => router.replace("/import/confirmation" as never)}><View><SummaryRow label="Method" value={importDraft.method === "air" ? "Air Freight" : "Sea Freight"} onEdit={() => setMethodEditOpen(true)} /><SummaryRow label="Route" value={`${importDraft.originCity ?? "Origin"}, ${importDraft.originCountry ?? ""} → ${importDraft.destinationCity ?? "Destination"}`} /><SummaryRow label="Cargo" value={cargoItemsSummary(importDraft.cargoItems, importDraft.cargoDescription || importDraft.cargoCategory || "Not selected")} /><SummaryRow label="Photos" value={importDraft.cargoPhotos?.length ? `${importDraft.cargoPhotos.length} added` : "None"} /><SummaryRow label="Supplier document" value={importDraft.supportingDocument?.name ?? "Not attached"} /><SummaryRow label="Consignee" value={importDraft.consignee?.name ?? "Not provided"} /></View><BookingQuickEditDrawer<"air" | "sea"> visible={methodEditOpen} overline="Import method" title="Change freight method" detail="Change this preference without leaving your review." value={(importDraft.method ?? "air") as "air" | "sea"} choices={importMethodEditChoices} approveLabel="Update method" onDismiss={() => setMethodEditOpen(false)} onApprove={(method) => { updateImportDraft({ method }); setMethodEditOpen(false); }} /></BookingScreen>; }
