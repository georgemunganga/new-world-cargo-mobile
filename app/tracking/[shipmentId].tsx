import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { LiveTrackingMap } from "@/components/tracking/live-tracking-map";
import { DeliveryInstructionsCard, DeliveryProgressCard, LiveShipmentContextCard, TrackingActionList, TrackingContactCard, TrackingHistoryPanel, TrackingReferenceActions } from "@/components/tracking/tracking-cards";
import { AppIcon } from "@/components/ui/app-icon";
import { PrimaryButton, Screen } from "@/components/ui/nwc-ui";
import { toUiShipment } from "@/lib/mappers/shipment-ui-mapper";
import { isActiveShipment } from "@/lib/shipment-navigation";
import { getLiveTrackingHistory } from "@/lib/live-tracking-history";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerShipment } from "@/lib/use-cases/use-customer-shipment";

export default function LiveTrackingScreen() {
  const { shipmentId } = useLocalSearchParams<{ shipmentId: string }>();
  const shipmentState = useCustomerShipment(shipmentId, { pollIntervalMs: 15000 });
  const shipment = shipmentState.shipment ? toUiShipment(shipmentState.shipment) : null;
  const [instructions, setInstructions] = useState("");
  const [historyOpen, setHistoryOpen] = useState(false);
  if (!shipment) return <TrackingStateScreen status={shipmentState.status} message={shipmentState.errorMessage} onRetry={shipmentState.refresh} />;
  if (!isActiveShipment(shipment)) return <Redirect href={`/shipments/${shipment.id}` as never} />;
  const contact = shipment.trackingContact ?? { name: "New WorldCargo", role: "Shipment support", phone: "+260 970 020 190", verified: true };
  const showUnavailable = (label: string) => Alert.alert(label, "Live delivery communication is not available for this shipment yet. Please use support if the cargo needs attention.");
  const history = getLiveTrackingHistory(shipment);
  const updateLabel = shipmentState.isStale
    ? "Connection lost · showing the last server update"
    : `Server updated ${formatUpdateTime(shipment.updatedAt ?? shipmentState.lastUpdatedAt)}`;
  return <Screen><View style={styles.page}><View style={styles.mapArea}><LiveTrackingMap shipment={shipment} /><View style={styles.mapHeader}><RoundControl label="Go back" icon="arrow-left" onPress={() => router.back()} /><View style={styles.headerActions}><RoundControl label="Refresh tracking" icon="refresh" onPress={() => void shipmentState.refresh()} /></View></View></View><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={[styles.freshness, shipmentState.isStale && styles.freshnessStale]}><AppIcon name={shipmentState.isStale ? "wifi-off" : "cloud-check-outline"} size={16} color={shipmentState.isStale ? nwcColors.warning : nwcColors.success} /><Text style={[styles.freshnessText, shipmentState.isStale && styles.freshnessTextStale]}>{updateLabel}</Text></View><LiveShipmentContextCard shipment={shipment} /><TrackingReferenceActions reference={shipment.reference} /><TrackingContactCard contact={contact} onMessage={() => showUnavailable("Message driver")} onCall={() => showUnavailable("Call driver")} /><DeliveryProgressCard shipment={shipment} /><DeliveryInstructionsCard initialValue={instructions} onSaved={setInstructions} /><TrackingActionList onPickup={shipment.status === "pending" ? () => router.push(`/pickups/${shipment.id}` as never) : undefined} onDelivery={shipment.status === "in_transit" || shipment.status === "out_for_delivery" ? () => router.push(`/shipments/${shipment.id}/manage` as never) : undefined} onOrder={() => router.push(`/orders/${shipment.id}` as never)} onPayment={() => router.push("/bills/payment" as never)} onSupport={() => router.push("/account" as never)} /><TrackingHistoryPanel events={history} open={historyOpen} onToggle={() => setHistoryOpen((open) => !open)} /><Text style={styles.trackingNote}>Tracking movement changes only when New WorldCargo records a new shipment event.</Text></ScrollView></View></Screen>;
}

function formatUpdateTime(value?: string) {
  if (!value) return "just now";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "just now" : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function TrackingStateScreen({ status, message, onRetry }: { status: "idle" | "loading" | "success" | "not-found" | "error"; message?: string; onRetry: () => void }) {
  const isError = status === "error";
  const title = status === "loading" || status === "idle" ? "Loading tracking" : isError ? "Tracking could not load" : "Shipment not found";
  const detail = status === "loading" || status === "idle" ? "Getting the latest shipment view." : isError ? message || "Try again when your connection is stable." : "Check the shipment reference and try again.";
  return <Screen><View style={styles.statePage}><View style={styles.stateIcon}><AppIcon name={isError ? "alert-circle-outline" : "package-variant"} size={30} color={nwcColors.primaryInk} /></View><Text style={styles.stateTitle}>{title}</Text><Text style={styles.stateDetail}>{detail}</Text>{isError ? <PrimaryButton label="Try again" onPress={onRetry} /> : null}</View></Screen>;
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
  trackingNote: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium", textAlign: "center", paddingHorizontal: 14, paddingTop: 2 },
  freshness: { minHeight: 38, borderRadius: 13, paddingHorizontal: 11, flexDirection: "row", alignItems: "center", gap: 7, backgroundColor: "#EAF7F0" },
  freshnessStale: { backgroundColor: "#FFF4DA" },
  freshnessText: { flex: 1, color: nwcColors.success, fontSize: 10, lineHeight: 15, fontFamily: "Poppins_700Bold" },
  freshnessTextStale: { color: nwcColors.warning },
  statePage: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 30, gap: 9, backgroundColor: nwcColors.background },
  stateIcon: { width: 68, height: 68, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary, marginBottom: 6 },
  stateTitle: { color: nwcColors.foreground, fontSize: 23, lineHeight: 29, fontFamily: "Poppins_800ExtraBold", textAlign: "center" },
  stateDetail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium", textAlign: "center" },
});
