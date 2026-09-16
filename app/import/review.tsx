import { ShipmentTicket, ShipmentCharges } from "@/components/booking/shipment-ticket";
import { ShipmentReviewScreen } from "@/components/booking/shipment-review-screen";
import { useState } from "react";
import { router } from "expo-router";
import { Text } from "react-native";

import { BookingQuickEditDrawer } from "@/components/booking/booking-quick-edit-drawer";
import { SummaryRow } from "@/components/booking/booking-ui";

import { importMethodEditChoices } from "@/lib/booking-review-edits";
import { importSteps, isImportReady } from "@/lib/service-booking";
import { useSubmitBooking } from "@/lib/use-cases/use-submit-booking";
import { useBookingDraft } from "@/stores/booking-draft";

export default function ImportReviewScreen() { const { importDraft, updateImportDraft } = useBookingDraft(); const submission = useSubmitBooking(); const [methodEditOpen, setMethodEditOpen] = useState(false); const submit = async () => { const result = await submission.submit("import", importDraft); if (result) router.replace({ pathname: "/import/confirmation", params: { shipmentId: result.id, reference: result.reference, ...(result.confirmationCode ? { confirmationCode: result.confirmationCode } : {}) } } as never); }; return <ShipmentReviewScreen activeStep="review" serviceLabel="International Imports" progressSteps={importSteps} title="Review your import" detail="This starts an import request. Your final quote is confirmed after review." continueLabel={submission.status === "submitting" ? "Submitting..." : "Request import quote"} continueDisabled={!isImportReady(importDraft) || submission.status === "submitting"} onContinue={submit}><ShipmentTicket draft={importDraft} onEditRoute={() => router.push("/import/route" as never)} onEditCargo={() => router.push("/import/cargo" as never)} onEditContacts={() => router.push("/import/consignee" as never)} /><SummaryRow label="Shipping method" value={importDraft.method === "air" ? "Air freight" : "Sea freight"} onEdit={() => setMethodEditOpen(true)} />{importDraft.supportingDocument ? <SummaryRow label="Document" value={importDraft.supportingDocument.name} onEdit={() => router.push("/import/cargo" as never)} /> : null}<ShipmentCharges quote={importDraft.quote} />{submission.errorMessage ? <Text style={{ color: "#B42318", fontSize: 12, fontWeight: "700" }}>{submission.errorMessage}</Text> : null}<BookingQuickEditDrawer<"air" | "sea"> visible={methodEditOpen} overline="Import method" title="Change freight method" detail="Change this preference without leaving your review." value={(importDraft.method ?? "air") as "air" | "sea"} choices={importMethodEditChoices} approveLabel="Update method" onDismiss={() => setMethodEditOpen(false)} onApprove={(method) => { updateImportDraft({ method }); setMethodEditOpen(false); }} /></ShipmentReviewScreen>; }
