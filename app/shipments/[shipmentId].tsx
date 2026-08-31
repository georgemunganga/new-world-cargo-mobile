import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, PrimaryButton, RouteLine, Screen, SectionHeader, StatusBadge } from "@/components/ui/nwc-ui";
import { shipments, statusPresentation } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";

const timeline = [
  { label: "Out for delivery", detail: "Your courier has collected the parcel.", time: "Today · 14:05", done: true },
  { label: "Pickup confirmed", detail: "The sender handed the parcel to New WorldCargo.", time: "Today · 13:42", done: true },
  { label: "Booking confirmed", detail: "Your Local Delivery was accepted.", time: "Today · 13:18", done: true },
];

export default function ShipmentDetailScreen() {
  const { shipmentId } = useLocalSearchParams<{ shipmentId: string }>();
  const shipment = shipments.find((item) => item.id === shipmentId) ?? shipments[0];
  const status = statusPresentation[shipment.status];
  return <Screen><View style={styles.page}><View style={styles.header}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={styles.headerTitle}>Shipment details</Text><View style={styles.shareButton}><AppIcon name="package-variant-closed" size={20} color={nwcColors.brandNavy} /></View></View><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.lead}><Text style={styles.reference}>{shipment.reference}</Text><Text style={styles.title}>{shipment.title}</Text><StatusBadge label={status.label} tone={status.tone} icon={status.icon as any} /></View><Card style={styles.routeCard}><RouteLine from={`${shipment.pickup.area}, ${shipment.pickup.city}`} to={`${shipment.destination.area}, ${shipment.destination.city}`} /><View style={styles.etaWrap}><AppIcon name="clock-time-four-outline" size={18} color={nwcColors.info} /><View><Text style={styles.etaLabel}>Estimated arrival</Text><Text style={styles.eta}>{shipment.eta}</Text></View></View></Card>{shipment.status === "out_for_delivery" ? <View style={styles.deliveryNote}><AppIcon name="phone-outline" size={20} color={nwcColors.warning} /><Text style={styles.deliveryNoteText}>Keep your phone nearby. The courier may call as they approach.</Text></View> : null}<SectionHeader eyebrow="Tracking" title="Latest activity" /><Card style={styles.timelineCard}>{timeline.map((event, index) => <View key={event.label} style={styles.timelineItem}><View style={styles.timelineMark}><View style={styles.timelineDot}><AppIcon name="check" size={13} color={nwcColors.white} /></View>{index < timeline.length - 1 ? <View style={styles.timelineLine} /> : null}</View><View style={styles.timelineCopy}><Text style={styles.timelineTitle}>{event.label}</Text><Text style={styles.timelineDetail}>{event.detail}</Text><Text style={styles.timelineTime}>{event.time}</Text></View></View>)}</Card><PrimaryButton label="Get help with this shipment" icon="headset" onPress={() => router.push("/account")} /></ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 20, fontWeight: "800" },
  shareButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: nwcColors.border, backgroundColor: nwcColors.surface },
  content: { paddingTop: 20, paddingBottom: 30, gap: 22 },
  lead: { gap: 5 },
  reference: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.6 },
  title: { color: nwcColors.foreground, fontSize: 29, lineHeight: 36, fontWeight: "800", letterSpacing: -0.4 },
  routeCard: { gap: 17 },
  etaWrap: { borderTopWidth: 1, borderTopColor: nwcColors.border, paddingTop: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  etaLabel: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontWeight: "700" },
  eta: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontWeight: "800", marginTop: 1 },
  deliveryNote: { borderRadius: 16, padding: 14, backgroundColor: "#FBF0D8", flexDirection: "row", alignItems: "center", gap: 10 },
  deliveryNoteText: { flex: 1, color: nwcColors.warning, fontSize: 13, lineHeight: 19, fontWeight: "700" },
  timelineCard: { paddingVertical: 5, gap: 0 },
  timelineItem: { flexDirection: "row", gap: 12, minHeight: 89 },
  timelineMark: { alignItems: "center", width: 22 },
  timelineDot: { height: 22, width: 22, borderRadius: 11, backgroundColor: nwcColors.success, alignItems: "center", justifyContent: "center" },
  timelineLine: { width: 2, flex: 1, backgroundColor: "#C6E6D7", marginVertical: 3 },
  timelineCopy: { flex: 1, gap: 3, paddingBottom: 14 },
  timelineTitle: { color: nwcColors.foreground, fontSize: 15, lineHeight: 20, fontWeight: "800" },
  timelineDetail: { color: nwcColors.muted, fontSize: 13, lineHeight: 18, fontWeight: "500" },
  timelineTime: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontWeight: "700", marginTop: 2 },
});
