import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { BookingScreen, BookingSection, SummaryRow } from "@/components/booking/booking-ui";
import { Card, StatusBadge } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";
import { useBookingDraft } from "@/stores/booking-draft";

export default function LocalDeliveryReviewScreen() {
  const { localDraft, setBookingStep } = useBookingDraft();
  const summary = {
    route: `${localDraft.pickup?.area || "Pickup"} → ${localDraft.destination?.area || "Delivery"}`,
    parcel: `${localDraft.parcelCategory || "Parcel"}${localDraft.parcelDescription ? ` · ${localDraft.parcelDescription}` : ""}`,
    contacts: `${localDraft.sender?.name || "Sender"} → ${localDraft.receiver?.name || "Receiver"}`,
    schedule: localDraft.schedule === "later_today" ? "Later today" : localDraft.schedule === "scheduled" ? "Another day" : "As soon as possible",
  };
  const edit = (route: "/local-delivery/route" | "/local-delivery/parcel" | "/local-delivery/contacts" | "/local-delivery/schedule", step: "route" | "parcel" | "contacts" | "schedule") => { setBookingStep(step); router.push(route as Href); };
  return <BookingScreen activeStep="review" title="Review your Local Delivery" detail="Check the details before you submit the booking request." continueLabel="Confirm delivery request" onContinue={() => router.replace("/local-delivery/confirmation" as Href)} secondaryLabel="Save as draft" onSecondary={() => router.push("/send")}><Card style={styles.reviewCard}><SummaryRow label="Route" value={summary.route} onEdit={() => edit("/local-delivery/route", "route")} /><SummaryRow label="Parcel" value={summary.parcel} onEdit={() => edit("/local-delivery/parcel", "parcel")} /><SummaryRow label="Contacts" value={summary.contacts} onEdit={() => edit("/local-delivery/contacts", "contacts")} /><SummaryRow label="Pickup" value={summary.schedule} onEdit={() => edit("/local-delivery/schedule", "schedule")} /></Card><BookingSection label="Price and payment"><View style={styles.quoteState}><StatusBadge label="Estimate pending" tone="info" icon="clock-time-four-outline" /><Text style={styles.quoteTitle}>We will confirm the price before payment.</Text><Text style={styles.quoteDetail}>This frontend preview does not create a live booking or collect payment. In the connected app, you will see the exact price and payment method before you confirm.</Text></View></BookingSection><View style={styles.terms}><Text style={styles.termsText}>By continuing, you confirm that the parcel is permitted for local transport and that the pickup and delivery details are accurate.</Text></View></BookingScreen>;
}

const styles = StyleSheet.create({
  reviewCard: { paddingVertical: 2 },
  quoteState: { borderRadius: 18, backgroundColor: "#EAF4F8", padding: 16, gap: 9 },
  quoteTitle: { color: nwcColors.foreground, fontSize: 15, lineHeight: 21, fontWeight: "800" },
  quoteDetail: { color: nwcColors.info, fontSize: 13, lineHeight: 19, fontWeight: "600" },
  terms: { borderRadius: 14, backgroundColor: "#F4F7F8", padding: 14 },
  termsText: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontWeight: "600" },
});
