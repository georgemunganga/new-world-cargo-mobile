import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, PrimaryButton, Screen, SecondaryButton } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";
import { useBookingDraft } from "@/stores/booking-draft";

export default function LocalDeliveryConfirmationScreen() {
  const { localDraft, resetLocalDraft } = useBookingDraft();
  const goHome = () => { resetLocalDraft(); router.replace("/"); };
  return <Screen><View style={styles.screen}><View style={styles.hero}><View style={styles.successIcon}><AppIcon name="check" size={36} color={nwcColors.primaryInk} /></View><Text style={styles.eyebrow}>Frontend booking preview</Text><Text style={styles.title}>Your Local Delivery request is ready.</Text><Text style={styles.detail}>In the connected app, New WorldCargo will confirm availability, price, and your official booking reference before collecting payment.</Text></View><Card style={styles.card}><Text style={styles.cardLabel}>Route summary</Text><Text style={styles.route}>{`${localDraft.pickup?.area || "Pickup"} → ${localDraft.destination?.area || "Delivery"}`}</Text><View style={styles.divider} /><Text style={styles.cardDetail}>{`${localDraft.receiver?.name || "Receiver"} · ${localDraft.schedule === "later_today" ? "Later today" : "Earliest available pickup"}`}</Text></Card><View style={styles.actions}><PrimaryButton label="View shipment experience" icon="package-variant-closed" onPress={() => router.replace("/shipments/nwc-24518" as Href)} /><SecondaryButton label="Back to Home" onPress={goHome} /></View></View></Screen>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nwcColors.background, justifyContent: "center", paddingHorizontal: 24, paddingBottom: 26, gap: 28 },
  hero: { alignItems: "center", gap: 10 },
  successIcon: { width: 78, height: 78, borderRadius: 28, backgroundColor: nwcColors.primary, justifyContent: "center", alignItems: "center", marginBottom: 10 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.7, textTransform: "uppercase", textAlign: "center" },
  title: { color: nwcColors.foreground, fontSize: 29, lineHeight: 37, fontWeight: "800", letterSpacing: -0.4, textAlign: "center" },
  detail: { color: nwcColors.muted, fontSize: 15, lineHeight: 22, fontWeight: "500", textAlign: "center", maxWidth: 360 },
  card: { gap: 7 },
  cardLabel: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.5, textTransform: "uppercase" },
  route: { color: nwcColors.foreground, fontSize: 18, lineHeight: 24, fontWeight: "800" },
  divider: { height: 1, backgroundColor: nwcColors.border, marginVertical: 7 },
  cardDetail: { color: nwcColors.muted, fontSize: 13, lineHeight: 18, fontWeight: "700" },
  actions: { gap: 10 },
});
