import { Image, StyleSheet, Text, TouchableOpacity, View, type GestureResponderEvent, type ImageSourcePropType } from "react-native";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { Card, StatusBadge } from "@/components/ui/nwc-ui";
import { statusPresentation } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";
import type { ServiceType, Shipment } from "@/types/cargo";

const serviceInfo: Record<ServiceType, { label: string; detail: string; icon: AppIconName }> = {
  import: { label: "Import Cargo", detail: "Outside Zambia to Zambia", icon: "airplane" },
  intercity: { label: "City-to-City Katundu", detail: "One Zambian city to another", icon: "truck-fast-outline" },
  local: { label: "Local Delivery", detail: "Pickup and delivery within your city", icon: "map-marker-path" },
};

export function ServiceCard({ service, onPress, status = "available", image }: { service: ServiceType; onPress?: (event: GestureResponderEvent) => void; status?: "available" | "next"; image?: ImageSourcePropType }) {
  const item = serviceInfo[service];
  const active = status === "available" && onPress;
  const body = <><View style={styles.serviceCopy}><View style={[styles.serviceIcon, service === "local" && styles.serviceIconPrimary]}><AppIcon name={item.icon} size={21} color={service === "local" ? nwcColors.primaryInk : nwcColors.brandNavy} /></View><Text style={styles.serviceTitle}>{item.label}</Text><Text style={styles.serviceDetail}>{item.detail}</Text></View>{image ? <Image source={image} resizeMode="contain" style={[styles.serviceArtwork, service === "local" && styles.localArtwork]} /> : null}<View style={styles.serviceEnd}>{status === "next" ? <Text style={styles.nextLabel}>Coming soon</Text> : <AppIcon name="arrow-top-right" size={20} color={nwcColors.brandNavy} />}</View></>;
  if (active) return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Start ${item.label}`} accessibilityHint={item.detail} activeOpacity={0.78} onPress={onPress} style={styles.serviceCard}>{body}</TouchableOpacity>;
  return <View accessibilityRole="text" style={[styles.serviceCard, styles.serviceCardInactive]}>{body}</View>;
}

export function ShipmentCard({ shipment, onPress }: { shipment: Shipment; onPress: () => void }) {
  const presentation = statusPresentation[shipment.status];
  const service = serviceInfo[shipment.service];
  const serviceTone = shipment.service === "import" ? styles.importService : shipment.service === "intercity" ? styles.intercityService : styles.localService;
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Open shipment ${shipment.reference}`} accessibilityHint={`${service.label}. ${presentation.label}. ${shipment.eta}`} onPress={onPress} activeOpacity={0.78}><Card style={styles.shipmentCard}><View style={styles.shipmentHeader}><View style={[styles.serviceTag, serviceTone]}><AppIcon name={service.icon} size={13} color={shipment.service === "local" ? nwcColors.primaryInk : nwcColors.brandNavy} /><Text style={styles.serviceTagText}>{service.label}</Text></View><StatusBadge label={presentation.label} tone={presentation.tone} icon={presentation.icon as AppIconName} /></View><View><Text style={styles.shipmentReference}>{shipment.reference}</Text><Text style={styles.shipmentTitle}>{shipment.title}</Text></View><View style={styles.shipmentRoute}><View style={styles.endpoint}><Text style={styles.endpointLabel}>From</Text><Text style={styles.endpointText} numberOfLines={1}>{shipment.pickup.area}</Text></View><View style={styles.routeConnector}><View style={styles.routeStart} /><View style={styles.routeLine} /><View style={styles.routeEnd} /></View><View style={[styles.endpoint, styles.destinationEndpoint]}><Text style={styles.endpointLabel}>To</Text><Text style={styles.endpointText} numberOfLines={1}>{shipment.destination.area}</Text></View></View><View style={styles.shipmentFooter}><View style={styles.etaGroup}><Text style={styles.etaLabel}>Estimated arrival</Text><Text style={styles.etaText}>{shipment.eta}</Text></View><View style={styles.openControl}><Text style={styles.openLabel}>Open</Text><AppIcon name="arrow-top-right" size={17} color={nwcColors.brandNavy} /></View></View></Card></TouchableOpacity>;
}

export function ActionRequiredCard({ title, detail, onPress }: { title: string; detail: string; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={title} accessibilityHint={detail} onPress={onPress} activeOpacity={0.8} style={styles.actionCard}><View style={styles.actionIcon}><AppIcon name="alert-circle-outline" size={22} color={nwcColors.warning} /></View><View style={styles.actionCopy}><Text style={styles.actionTitle}>{title}</Text><Text style={styles.actionDetail}>{detail}</Text></View><AppIcon name="chevron-right" size={22} color={nwcColors.brandNavy} /></TouchableOpacity>;
}

const styles = StyleSheet.create({
  serviceCard: { minHeight: 126, borderWidth: 1, borderColor: "#E5ECEE", backgroundColor: nwcColors.surface, borderRadius: 24, padding: 15, overflow: "hidden", justifyContent: "space-between" },
  serviceCardInactive: { opacity: 0.76 },
  serviceIcon: { height: 40, width: 40, borderRadius: 14, backgroundColor: "#EAF1F4", alignItems: "center", justifyContent: "center" },
  serviceIconPrimary: { backgroundColor: nwcColors.primary },
  serviceCopy: { flex: 1, gap: 5, maxWidth: "63%" },
  serviceTitle: { color: nwcColors.foreground, fontSize: 18, lineHeight: 23, fontFamily: "Poppins_800ExtraBold" },
  serviceDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_500Medium" },
  serviceArtwork: { position: "absolute", right: -4, bottom: -7, width: 122, height: 102 },
  localArtwork: { right: -23, bottom: -14, width: 154, height: 119 },
  serviceEnd: { position: "absolute", right: 13, top: 13, alignItems: "flex-end", justifyContent: "center" },
  nextLabel: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold" },
  shipmentCard: { gap: 14, padding: 17 },
  shipmentHeader: { flexDirection: "row", justifyContent: "space-between", gap: 12, alignItems: "flex-start" },
  serviceTag: { minHeight: 27, alignSelf: "flex-start", borderRadius: 9, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8 },
  localService: { backgroundColor: nwcColors.primary },
  intercityService: { backgroundColor: "#EAF4F8" },
  importService: { backgroundColor: "#EAF1F4" },
  serviceTagText: { color: nwcColors.brandNavy, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold" },
  shipmentReference: { color: nwcColors.muted, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.65 },
  shipmentTitle: { color: nwcColors.foreground, fontSize: 18, lineHeight: 24, fontFamily: "Poppins_800ExtraBold", marginTop: 2 },
  shipmentRoute: { flexDirection: "row", alignItems: "flex-end", gap: 8, borderTopWidth: 1, borderTopColor: nwcColors.border, paddingTop: 13 },
  endpoint: { flex: 1, minWidth: 0, gap: 2 },
  destinationEndpoint: { alignItems: "flex-end" },
  endpointLabel: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.6, textTransform: "uppercase" },
  endpointText: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_700Bold" },
  routeConnector: { width: 48, height: 23, paddingBottom: 3, flexDirection: "row", alignItems: "center" },
  routeStart: { width: 7, height: 7, borderRadius: 4, backgroundColor: nwcColors.brandNavy },
  routeLine: { flex: 1, height: 1.5, backgroundColor: nwcColors.border },
  routeEnd: { width: 8, height: 8, borderRadius: 2, backgroundColor: nwcColors.primary, borderWidth: 1, borderColor: nwcColors.primaryInk },
  shipmentFooter: { borderTopWidth: 1, borderTopColor: nwcColors.border, paddingTop: 12, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10 },
  etaGroup: { flex: 1, gap: 1 },
  etaLabel: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.6, textTransform: "uppercase" },
  etaText: { color: nwcColors.foreground, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_700Bold" },
  openControl: { minHeight: 32, flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 11, paddingHorizontal: 8, backgroundColor: "#EAF1F4" },
  openLabel: { color: nwcColors.brandNavy, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold" },
  actionCard: { backgroundColor: "#FBF0D8", borderRadius: 18, padding: 15, gap: 12, flexDirection: "row", alignItems: "center" },
  actionIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: nwcColors.surface, alignItems: "center", justifyContent: "center" },
  actionCopy: { flex: 1, gap: 2 },
  actionTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontWeight: "800" },
  actionDetail: { color: nwcColors.warning, fontSize: 12, lineHeight: 17, fontWeight: "700" },
});
