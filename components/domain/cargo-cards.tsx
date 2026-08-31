import { StyleSheet, Text, TouchableOpacity, View, type GestureResponderEvent } from "react-native";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { Card, RouteLine, StatusBadge } from "@/components/ui/nwc-ui";
import { statusPresentation } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";
import type { ServiceType, Shipment } from "@/types/cargo";

const serviceInfo: Record<ServiceType, { label: string; detail: string; icon: AppIconName }> = {
  import: { label: "Import Cargo", detail: "Outside Zambia to Zambia", icon: "airplane" },
  intercity: { label: "City-to-City Katundu", detail: "One Zambian city to another", icon: "truck-fast-outline" },
  local: { label: "Local Delivery", detail: "Pickup and delivery within your city", icon: "map-marker-path" },
};

export function ServiceCard({ service, onPress, status = "available" }: { service: ServiceType; onPress?: (event: GestureResponderEvent) => void; status?: "available" | "next" }) {
  const item = serviceInfo[service];
  const active = status === "available" && onPress;
  const body = <><View style={[styles.serviceIcon, service === "local" && styles.serviceIconPrimary]}><AppIcon name={item.icon} size={22} color={service === "local" ? nwcColors.primaryInk : nwcColors.brandNavy} /></View><View style={styles.serviceCopy}><Text style={styles.serviceTitle}>{item.label}</Text><Text style={styles.serviceDetail}>{item.detail}</Text></View><View style={styles.serviceEnd}>{status === "next" ? <Text style={styles.nextLabel}>Next</Text> : <AppIcon name="chevron-right" size={22} color={nwcColors.muted} />}</View></>;
  if (active) return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Start ${item.label}`} accessibilityHint={item.detail} activeOpacity={0.78} onPress={onPress} style={styles.serviceCard}>{body}</TouchableOpacity>;
  return <View accessibilityRole="text" style={[styles.serviceCard, styles.serviceCardInactive]}>{body}</View>;
}

export function ShipmentCard({ shipment, onPress }: { shipment: Shipment; onPress: () => void }) {
  const presentation = statusPresentation[shipment.status];
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Open shipment ${shipment.reference}`} accessibilityHint={`${presentation.label}. ${shipment.eta}`} onPress={onPress} activeOpacity={0.78}><Card style={styles.shipmentCard}><View style={styles.shipmentHeader}><View><Text style={styles.shipmentReference}>{shipment.reference}</Text><Text style={styles.shipmentTitle}>{shipment.title}</Text></View><StatusBadge label={presentation.label} tone={presentation.tone} icon={presentation.icon as AppIconName} /></View><View style={styles.shipmentRoute}><RouteLine from={`${shipment.pickup.area}, ${shipment.pickup.city}`} to={`${shipment.destination.area}, ${shipment.destination.city}`} /></View><View style={styles.shipmentFooter}><View style={styles.etaGroup}><AppIcon name="clock-time-four-outline" size={16} color={nwcColors.muted} /><Text style={styles.etaText}>{shipment.eta}</Text></View><AppIcon name="arrow-right" size={18} color={nwcColors.brandNavy} /></View></Card></TouchableOpacity>;
}

export function ActionRequiredCard({ title, detail, onPress }: { title: string; detail: string; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={title} accessibilityHint={detail} onPress={onPress} activeOpacity={0.8} style={styles.actionCard}><View style={styles.actionIcon}><AppIcon name="alert-circle-outline" size={22} color={nwcColors.warning} /></View><View style={styles.actionCopy}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionDetail}>{detail}</Text></View><AppIcon name="chevron-right" size={22} color={nwcColors.brandNavy} /></TouchableOpacity>;
}

const styles = StyleSheet.create({
  serviceCard: { minHeight: 92, borderWidth: 1, borderColor: nwcColors.border, backgroundColor: nwcColors.surface, borderRadius: 18, padding: 14, flexDirection: "row", alignItems: "center", gap: 12 },
  serviceCardInactive: { opacity: 0.76 },
  serviceIcon: { height: 48, width: 48, borderRadius: 16, backgroundColor: "#EAF1F4", alignItems: "center", justifyContent: "center" },
  serviceIconPrimary: { backgroundColor: nwcColors.primary },
  serviceCopy: { flex: 1, gap: 3 },
  serviceTitle: { color: nwcColors.foreground, fontSize: 16, lineHeight: 21, fontWeight: "800" },
  serviceDetail: { color: nwcColors.muted, fontSize: 13, lineHeight: 18, fontWeight: "500" },
  serviceEnd: { alignItems: "flex-end", justifyContent: "center" },
  nextLabel: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontWeight: "800" },
  shipmentCard: { gap: 16 },
  shipmentHeader: { flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: "flex-start" },
  shipmentReference: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.5 },
  shipmentTitle: { color: nwcColors.foreground, fontSize: 17, lineHeight: 23, fontWeight: "800", marginTop: 2 },
  shipmentRoute: { borderTopWidth: 1, borderTopColor: nwcColors.border, paddingTop: 14 },
  shipmentFooter: { borderTopWidth: 1, borderTopColor: nwcColors.border, paddingTop: 13, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  etaGroup: { flexDirection: "row", alignItems: "center", gap: 6, flex: 1 },
  etaText: { color: nwcColors.muted, fontSize: 13, lineHeight: 18, fontWeight: "700" },
  actionCard: { backgroundColor: "#FBF0D8", borderRadius: 18, padding: 15, gap: 12, flexDirection: "row", alignItems: "center" },
  actionIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: nwcColors.surface, alignItems: "center", justifyContent: "center" },
  actionCopy: { flex: 1, gap: 2 },
  actionTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontWeight: "800" },
  actionDetail: { color: nwcColors.warning, fontSize: 12, lineHeight: 17, fontWeight: "700" },
});
