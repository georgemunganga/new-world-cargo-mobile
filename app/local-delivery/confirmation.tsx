import { StyleSheet, Text, View } from "react-native";

import { BookingConfirmation } from "@/components/booking/booking-confirmation";
import { Card } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";
import { pickupTimeLabel } from "@/lib/pickup-schedule";
import { useBookingDraft } from "@/stores/booking-draft";

export default function LocalDeliveryConfirmationScreen() {
  const { localDraft, resetLocalDraft } = useBookingDraft();
  const pickupLabel = localDraft.schedule === "scheduled" && localDraft.scheduledAt
    ? pickupTimeLabel(localDraft.scheduledAt)
    : localDraft.schedule === "later_today"
      ? "Later today"
      : "Earliest available pickup";

  return (
    <BookingConfirmation
      icon="check"
      title="Your Local Delivery request was received."
      detail="New WorldCargo will confirm availability, price, and the next step before collection."
      onReset={resetLocalDraft}
    >
      <Card style={styles.card}>
        <Text style={styles.cardLabel}>Route summary</Text>
        <Text style={styles.route}>{`${localDraft.pickup?.area || "Pickup"} → ${localDraft.destination?.area || "Delivery"}`}</Text>
        <View style={styles.divider} />
        <Text style={styles.cardDetail}>{`${localDraft.receiver?.name || "Receiver"} · ${pickupLabel}`}</Text>
      </Card>
    </BookingConfirmation>
  );
}

const styles = StyleSheet.create({
  card: { gap: 7 },
  cardLabel: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.5, textTransform: "uppercase" },
  route: { color: nwcColors.foreground, fontSize: 18, lineHeight: 24, fontWeight: "800" },
  divider: { height: 1, backgroundColor: nwcColors.border, marginVertical: 7 },
  cardDetail: { color: nwcColors.muted, fontSize: 13, lineHeight: 18, fontWeight: "700" },
});
