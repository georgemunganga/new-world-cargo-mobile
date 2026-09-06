import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";

import { BookingScreen, BookingSection, SummaryRow } from "@/components/booking/booking-ui";
import { cargoItemsSummary } from "@/lib/booking-cargo";
import { Card, StatusBadge } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";
import { useBookingDraft } from "@/stores/booking-draft";

const requestLabels = { cargo: "Special cargo", business: "Business movement", other: "Other request" } as const;

export default function CustomReviewScreen() {
  const { customDraft } = useBookingDraft();
  const summary = {
    route: `${customDraft.pickup?.area || "Pickup"} → ${customDraft.destination?.area || "Destination"}`,
    request: customDraft.requestType && customDraft.requestType in requestLabels ? requestLabels[customDraft.requestType as keyof typeof requestLabels] : "Not selected",
    cargo: cargoItemsSummary(customDraft.cargoItems, "Not added"),
    details: customDraft.requestDetail?.trim() || "No extra details added",
  };
  const edit = (href: "/custom/route" | "/custom/details") => router.push(href as Href);
  return <BookingScreen activeStep="review" serviceLabel="Custom Request" progressSteps={[{ id: "route", label: "Route" }, { id: "details", label: "Details" }, { id: "review", label: "Review" }]} title="Review your request" detail="Check the route and request before we send it to our cargo team." continueLabel="Submit request" onContinue={() => router.replace("/custom/confirmation" as Href)} secondaryLabel="Save as draft" onSecondary={() => router.push("/send" as Href)}><Card style={styles.summaryCard}><SummaryRow label="Route" value={summary.route} onEdit={() => edit("/custom/route")} /><SummaryRow label="Request" value={summary.request} onEdit={() => edit("/custom/details")} /><SummaryRow label="Cargo" value={summary.cargo} onEdit={() => edit("/custom/details")} />{customDraft.cargoPhotos?.length ? <SummaryRow label="Photos" value={`${customDraft.cargoPhotos.length} added`} onEdit={() => edit("/custom/details")} /> : null}{customDraft.supportingDocument ? <SummaryRow label="Supporting document" value={customDraft.supportingDocument.name} onEdit={() => edit("/custom/details")} /> : null}<SummaryRow label="Details" value={summary.details} onEdit={() => edit("/custom/details")} /></Card><BookingSection label="What happens next"><View style={styles.nextStep}><StatusBadge label="Tailored quote" tone="info" icon="clock-time-four-outline" /><Text style={styles.nextTitle}>We will review the request first.</Text><Text style={styles.nextDetail}>A New WorldCargo team member will confirm availability, pricing, and the next step before any payment is requested.</Text></View></BookingSection><View style={styles.note}><Text style={styles.noteText}>By submitting, you confirm the route details are accurate and the request is suitable for cargo review.</Text></View></BookingScreen>;
}

const styles = StyleSheet.create({
  summaryCard: { paddingVertical: 2 },
  nextStep: { borderRadius: 18, backgroundColor: "#EAF4F8", padding: 16, gap: 9 },
  nextTitle: { color: nwcColors.foreground, fontSize: 15, lineHeight: 21, fontFamily: "Poppins_800ExtraBold" },
  nextDetail: { color: nwcColors.info, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
  note: { borderRadius: 14, backgroundColor: "#F4F7F8", padding: 14 },
  noteText: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
});
