import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton, PrimaryButton, Screen, StatusBadge } from "@/components/ui/nwc-ui";
import { shipments, statusPresentation } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";

const timeline = [
  { label: "Out for delivery", detail: "Courier has your parcel.", time: "Today · 14:05" },
  { label: "Pickup confirmed", detail: "Parcel handed to New WorldCargo.", time: "Today · 13:42" },
  { label: "Booking confirmed", detail: "Local Delivery accepted.", time: "Today · 13:18" },
];

export default function ShipmentDetailScreen() {
  const { shipmentId } = useLocalSearchParams<{ shipmentId: string }>();
  const [historyOpen, setHistoryOpen] = useState(false);
  const shipment = shipments.find((item) => item.id === shipmentId) ?? shipments[0];
  const status = statusPresentation[shipment.status];
  const latest = timeline[0];
  return <Screen><View style={styles.page}><View style={styles.header}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={styles.headerTitle}>Tracking</Text><View style={styles.headerSpacer} /></View><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.lead}><Text style={styles.reference}>{shipment.reference}</Text><Text style={styles.title}>{shipment.title}</Text><StatusBadge label={status.label} tone={status.tone} icon={status.icon as any} /></View><View style={styles.routeHero}><View style={styles.routeTop}><View style={styles.routePoint}><Text style={styles.routeLabel}>From</Text><Text numberOfLines={1} style={styles.routeValue}>{shipment.pickup.area}</Text><Text numberOfLines={1} style={styles.routeCity}>{shipment.pickup.city}</Text></View><View style={styles.routeConnector}><View style={styles.routeLine} /><AppIcon name="arrow-right" size={19} color="#AFC2CC" /></View><View style={[styles.routePoint, styles.routePointEnd]}><Text style={styles.routeLabel}>To</Text><Text numberOfLines={1} style={styles.routeValue}>{shipment.destination.area}</Text><Text numberOfLines={1} style={styles.routeCity}>{shipment.destination.city}</Text></View></View><View style={styles.eta}><View style={styles.etaIcon}><AppIcon name="clock-time-four-outline" size={21} color={nwcColors.primaryInk} /></View><View><Text style={styles.etaLabel}>Estimated arrival</Text><Text style={styles.etaValue}>{shipment.eta}</Text></View></View></View>{shipment.status === "out_for_delivery" ? <View style={styles.deliveryNote}><AppIcon name="phone-outline" size={18} color={nwcColors.warning} /><Text style={styles.deliveryNoteText}>Keep your phone nearby for the courier.</Text></View> : null}<View style={styles.updateCard}><View style={styles.updateMark}><AppIcon name="check" size={17} color={nwcColors.white} /></View><View style={styles.updateCopy}><Text style={styles.updateEyebrow}>Latest update</Text><Text style={styles.updateTitle}>{latest.label}</Text><Text style={styles.updateTime}>{latest.time}</Text></View></View><TouchableOpacity accessibilityRole="button" accessibilityLabel={historyOpen ? "Hide tracking history" : "View tracking history"} accessibilityState={{ expanded: historyOpen }} activeOpacity={0.74} onPress={() => setHistoryOpen((open) => !open)} style={styles.historyToggle}><Text style={styles.historyToggleText}>{historyOpen ? "Hide tracking history" : `View tracking history · ${timeline.length} updates`}</Text><AppIcon name={historyOpen ? "chevron-up" : "chevron-down"} size={20} color={nwcColors.brandNavy} /></TouchableOpacity>{historyOpen ? <View style={styles.timeline}>{timeline.slice(1).map((event, index) => <View key={event.label} style={styles.timelineItem}><View style={styles.timelineRail}><View style={styles.timelineDot} />{index === 0 ? <View style={styles.timelineLine} /> : null}</View><View style={styles.timelineCopy}><Text style={styles.timelineTitle}>{event.label}</Text><Text style={styles.timelineDetail}>{event.detail}</Text><Text style={styles.timelineTime}>{event.time}</Text></View></View>)}</View> : null}<PrimaryButton label="Need help?" icon="headset" onPress={() => router.push("/account")} /></ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 16 },
  header: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
  headerSpacer: { width: 44, height: 44 },
  content: { paddingTop: 22, paddingBottom: 116, gap: 16 },
  lead: { gap: 6 },
  reference: { color: nwcColors.muted, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.6 },
  title: { color: nwcColors.foreground, fontSize: 31, lineHeight: 38, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.6 },
  routeHero: { gap: 22, borderRadius: 28, padding: 18, backgroundColor: nwcColors.brandNavy },
  routeTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  routePoint: { flex: 1, gap: 1 },
  routePointEnd: { alignItems: "flex-end" },
  routeLabel: { color: "#AFC2CC", fontSize: 10, lineHeight: 14, fontFamily: "Poppins_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  routeValue: { maxWidth: 112, color: nwcColors.white, fontSize: 16, lineHeight: 21, fontFamily: "Poppins_800ExtraBold" },
  routeCity: { maxWidth: 112, color: "#C5D2D8", fontSize: 11, lineHeight: 15, fontFamily: "Poppins_500Medium" },
  routeConnector: { width: 46, alignItems: "center", justifyContent: "center" },
  routeLine: { position: "absolute", left: 0, right: 0, height: 1, backgroundColor: "#527086" },
  eta: { flexDirection: "row", alignItems: "center", gap: 10, borderTopWidth: 1, borderTopColor: "#28465C", paddingTop: 14 },
  etaIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  etaLabel: { color: "#AFC2CC", fontSize: 11, lineHeight: 15, fontFamily: "Poppins_600SemiBold" },
  etaValue: { color: nwcColors.white, fontSize: 15, lineHeight: 21, fontFamily: "Poppins_800ExtraBold" },
  deliveryNote: { borderRadius: 18, padding: 13, backgroundColor: "#FBF0D8", flexDirection: "row", alignItems: "center", gap: 9 },
  deliveryNoteText: { flex: 1, color: nwcColors.warning, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_700Bold" },
  updateCard: { minHeight: 79, borderRadius: 20, backgroundColor: nwcColors.white, borderWidth: 1, borderColor: "#E5ECEE", padding: 14, flexDirection: "row", alignItems: "center", gap: 11 },
  updateMark: { width: 38, height: 38, borderRadius: 19, backgroundColor: nwcColors.success, alignItems: "center", justifyContent: "center" },
  updateCopy: { flex: 1, gap: 1 },
  updateEyebrow: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  updateTitle: { color: nwcColors.foreground, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
  updateTime: { color: nwcColors.muted, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_500Medium" },
  historyToggle: { minHeight: 48, paddingHorizontal: 4, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  historyToggleText: { color: nwcColors.brandNavy, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  timeline: { gap: 0, paddingHorizontal: 4 },
  timelineItem: { flexDirection: "row", gap: 11, minHeight: 72 },
  timelineRail: { width: 15, alignItems: "center" },
  timelineDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: nwcColors.border, marginTop: 5 },
  timelineLine: { width: 1, flex: 1, backgroundColor: nwcColors.border, marginVertical: 3 },
  timelineCopy: { flex: 1, gap: 1, paddingBottom: 12 },
  timelineTitle: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  timelineDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" },
  timelineTime: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_600SemiBold", marginTop: 2 },
});
