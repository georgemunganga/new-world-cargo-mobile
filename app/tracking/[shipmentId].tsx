import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { LiveTrackingMap } from "@/components/tracking/live-tracking-map";
import { DeliveryInstructionsCard, DeliveryProgressCard, LiveShipmentContextCard, TrackingActionList, TrackingContactCard, TrackingHistoryPanel, TrackingReferenceActions } from "@/components/tracking/tracking-cards";
import { AppIcon } from "@/components/ui/app-icon";
import { Screen } from "@/components/ui/nwc-ui";
import { shipments } from "@/lib/mock-cargo-data";
import { isActiveShipment } from "@/lib/shipment-navigation";
import { getLiveTrackingHistory } from "@/lib/live-tracking-history";
import { nwcColors } from "@/lib/nwc-theme";

export default function LiveTrackingScreen() {
  const { shipmentId } = useLocalSearchParams<{ shipmentId: string }>();
  const shipment = shipments.find((item) => item.id === shipmentId) ?? shipments[0];
  const contact = shipment.trackingContact ?? { name: "New WorldCargo", role: "Shipment support", phone: "+260 970 020 190", verified: true };
  const [instructions, setInstructions] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  if (!isActiveShipment(shipment)) return <Redirect href={`/shipments/${shipment.id}` as never} />;
  const showUnavailable = (label: string) => Alert.alert(`${label} preview`, "This frontend build uses mock contact actions. Live delivery communication will be connected later.");
  const history = getLiveTrackingHistory(shipment);
  return <Screen><View style={styles.page}><View style={styles.mapArea}><LiveTrackingMap shipment={shipment} /><View style={styles.mapHeader}><RoundControl label="Go back" icon="arrow-left" onPress={() => router.back()} /><View style={styles.headerActions}><RoundControl label="More tracking options" icon="dots-horizontal" onPress={() => showUnavailable("More options")} /></View></View></View><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><LiveShipmentContextCard shipment={shipment} /><TrackingReferenceActions reference={shipment.reference} /><TrackingContactCard contact={contact} onMessage={() => showUnavailable("Message driver")} onCall={() => showUnavailable("Call driver")} /><DeliveryProgressCard shipment={shipment} /><DeliveryInstructionsCard initialValue={instructions} onSaved={setInstructions} /><TrackingActionList onPickup={shipment.status === "pending" ? () => router.push(`/pickups/${shipment.id}` as never) : undefined} onDelivery={shipment.status === "in_transit" || shipment.status === "out_for_delivery" ? () => router.push(`/shipments/${shipment.id}/manage` as never) : undefined} onOrder={() => router.push(`/orders/${shipment.id}` as never)} onPayment={() => router.push("/bills/payment" as never)} onSupport={() => router.push("/account" as never)} /><TrackingHistoryPanel events={history} open={historyOpen} onToggle={() => setHistoryOpen((open) => !open)} /><Text style={styles.mockNote}>Tracking updates and courier contact actions are simulated for this frontend preview.</Text></ScrollView></View></Screen>;
}

function RoundControl({ label, icon, onPress }: { label: string; icon: Parameters<typeof AppIcon>[0]["name"]; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} activeOpacity={0.74} onPress={onPress} style={styles.roundControl}><AppIcon name={icon} size={24} color={nwcColors.primaryInk} /></TouchableOpacity>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  mapArea: { height: 328, position: "relative" },
  mapHeader: { position: "absolute", left: 20, right: 20, top: 15, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerActions: { flexDirection: "row", gap: 10 },
  roundControl: { width: 52, height: 52, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.96)", borderWidth: 1, borderColor: "#F0F3F4" },
  content: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 42, gap: 12 },
  mockNote: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium", textAlign: "center", paddingHorizontal: 14, paddingTop: 2 },
});
