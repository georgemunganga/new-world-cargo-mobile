import { useState } from "react";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Redirect, router, useLocalSearchParams } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { ProofOfDeliveryCard } from "@/components/tracking/tracking-cards";
import { IconButton, PrimaryButton, Screen } from "@/components/ui/nwc-ui";
import { shipments, statusPresentation } from "@/lib/mock-cargo-data";
import { isActiveShipment } from "@/lib/shipment-navigation";
import { exportProofOfDelivery } from "@/lib/customer-document-export";
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
  if (isActiveShipment(shipment)) return <Redirect href={`/tracking/${shipment.id}` as never} />;
  const isImport = shipment.service === "import";
  const foreground = isImport ? nwcColors.primaryInk : nwcColors.white;
  const muted = isImport ? "#4A4A45" : "#B9C8D1";
  const vehicleArtwork = shipment.service === "local" ? require("../../assets/images/services/new-world-scooter.png") : require("../../assets/images/services/new-world-truck.png");
  const downloadProof = () => { const result = exportProofOfDelivery(shipment); Alert.alert(result.status === "downloaded" ? "Proof downloaded" : "Proof ready", result.status === "downloaded" ? `${result.filename} was downloaded to your browser.` : "This preview can download proof records in a browser. Native save/share will be connected later."); };
  return <Screen><View style={styles.page}><View style={styles.header}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={styles.headerTitle}>Tracking</Text><View style={styles.headerSpacer} /></View><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.lead}><Text style={styles.reference}>{shipment.reference}</Text><Text style={styles.title}>{shipment.title}</Text></View><View style={[styles.routeHero, isImport ? styles.routeHeroImport : styles.routeHeroNavy]}><View pointerEvents="none" style={[styles.heroHalo, isImport ? styles.heroHaloImport : styles.heroHaloNavy]} /><View style={styles.heroHeader}><View style={[styles.statusChip, isImport ? styles.statusChipImport : styles.statusChipNavy]}><AppIcon name={status.icon as any} size={14} color={isImport ? nwcColors.white : nwcColors.primaryInk} /><Text style={[styles.statusText, { color: isImport ? nwcColors.white : nwcColors.primaryInk }]}>{status.label}</Text></View><AppIcon name={shipment.service === "local" ? "bike-fast" : shipment.service === "intercity" ? "truck-fast-outline" : "airplane"} size={23} color={isImport ? nwcColors.primaryInk : nwcColors.primary} /></View><View style={styles.routeTop}><View style={styles.routePoint}><Text style={[styles.routeLabel, { color: muted }]}>From</Text><Text numberOfLines={1} style={[styles.routeValue, { color: foreground }]}>{shipment.pickup.area}</Text><Text numberOfLines={1} style={[styles.routeCity, { color: muted }]}>{shipment.pickup.city}</Text></View><View style={styles.routeConnector}><View style={[styles.routeLine, { backgroundColor: isImport ? "#6E5926" : "#527086" }]} /><AppIcon name="arrow-right" size={19} color={isImport ? nwcColors.primaryInk : "#AFC2CC"} /></View><View style={[styles.routePoint, styles.routePointEnd]}><Text style={[styles.routeLabel, { color: muted }]}>To</Text><Text numberOfLines={1} style={[styles.routeValue, { color: foreground }]}>{shipment.destination.area}</Text><Text numberOfLines={1} style={[styles.routeCity, { color: muted }]}>{shipment.destination.city}</Text></View></View><View style={[styles.eta, { borderTopColor: isImport ? "#D6A72D" : "#28465C" }]}><View style={[styles.etaIcon, isImport ? styles.etaIconImport : styles.etaIconNavy]}><AppIcon name="clock-time-four-outline" size={21} color={nwcColors.primaryInk} /></View><View><Text style={[styles.etaLabel, { color: muted }]}>Estimated arrival</Text><Text style={[styles.etaValue, { color: foreground }]}>{shipment.eta}</Text></View></View></View>{shipment.status === "out_for_delivery" ? <View style={styles.deliveryNote}><View style={styles.deliveryNoteCopy}><AppIcon name="phone-outline" size={18} color={nwcColors.warning} /><Text style={styles.deliveryNoteText}>Keep your phone nearby for the courier.</Text></View><Image source={vehicleArtwork} resizeMode="contain" style={styles.deliveryVehicle} /></View> : null}{shipment.status === "delivered" ? <ProofOfDeliveryCard shipment={shipment} onDownload={downloadProof} /> : null}<View style={styles.updateCard}><View style={styles.updateMark}><AppIcon name="check" size={17} color={nwcColors.white} /></View><View style={styles.updateCopy}><Text style={styles.updateEyebrow}>Latest update</Text><Text style={styles.updateTitle}>{latest.label}</Text><Text style={styles.updateTime}>{latest.time}</Text></View></View><TouchableOpacity accessibilityRole="button" accessibilityLabel={historyOpen ? "Hide tracking history" : "View tracking history"} accessibilityState={{ expanded: historyOpen }} activeOpacity={0.74} onPress={() => setHistoryOpen((open) => !open)} style={styles.historyToggle}><Text style={styles.historyToggleText}>{historyOpen ? "Hide tracking history" : `View tracking history · ${timeline.length} updates`}</Text><AppIcon name={historyOpen ? "chevron-up" : "chevron-down"} size={20} color={nwcColors.brandNavy} /></TouchableOpacity>{historyOpen ? <View style={styles.timeline}>{timeline.slice(1).map((event, index) => <View key={event.label} style={styles.timelineItem}><View style={styles.timelineRail}><View style={styles.timelineDot} />{index === 0 ? <View style={styles.timelineLine} /> : null}</View><View style={styles.timelineCopy}><Text style={styles.timelineTitle}>{event.label}</Text><Text style={styles.timelineDetail}>{event.detail}</Text><Text style={styles.timelineTime}>{event.time}</Text></View></View>)}</View> : null}<PrimaryButton label="Need help?" icon="headset" onPress={() => router.push("/account")} /></ScrollView></View></Screen>;
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
  routeHero: { overflow: "hidden", gap: 22, borderRadius: 28, padding: 18 },
  routeHeroImport: { backgroundColor: nwcColors.primary },
  routeHeroNavy: { backgroundColor: nwcColors.brandNavy },
  heroHalo: { position: "absolute", right: -43, top: -50, width: 148, height: 148, borderRadius: 74, borderWidth: 18 },
  heroHaloImport: { borderColor: "rgba(13,13,13,0.14)" },
  heroHaloNavy: { borderColor: "rgba(255,200,61,0.3)" },
  heroHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  statusChip: { minHeight: 29, borderRadius: 10, paddingHorizontal: 9, flexDirection: "row", alignItems: "center", gap: 5 },
  statusChipImport: { backgroundColor: nwcColors.primaryInk },
  statusChipNavy: { backgroundColor: nwcColors.primary },
  statusText: { fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold" },
  routeTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  routePoint: { flex: 1, gap: 1 },
  routePointEnd: { alignItems: "flex-end" },
  routeLabel: { fontSize: 10, lineHeight: 14, fontFamily: "Poppins_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  routeValue: { maxWidth: 112, fontSize: 16, lineHeight: 21, fontFamily: "Poppins_800ExtraBold" },
  routeCity: { maxWidth: 112, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_500Medium" },
  routeConnector: { width: 46, alignItems: "center", justifyContent: "center" },
  routeLine: { position: "absolute", left: 0, right: 0, height: 1 },
  eta: { flexDirection: "row", alignItems: "center", gap: 10, borderTopWidth: 1, paddingTop: 14 },
  etaIcon: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  etaIconImport: { backgroundColor: "rgba(255,255,255,0.52)" },
  etaIconNavy: { backgroundColor: nwcColors.primary },
  etaLabel: { fontSize: 11, lineHeight: 15, fontFamily: "Poppins_600SemiBold" },
  etaValue: { fontSize: 15, lineHeight: 21, fontFamily: "Poppins_800ExtraBold" },
  deliveryNote: { minHeight: 68, overflow: "hidden", borderRadius: 18, paddingLeft: 13, paddingRight: 8, backgroundColor: "#FBF0D8", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 9 },
  deliveryNoteCopy: { flex: 1, flexDirection: "row", alignItems: "center", gap: 9, paddingVertical: 12 },
  deliveryNoteText: { flex: 1, color: nwcColors.warning, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_700Bold" },
  deliveryVehicle: { width: 94, height: 62, marginRight: -7 },
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
