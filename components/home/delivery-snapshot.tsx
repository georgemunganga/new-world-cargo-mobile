import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Circle, Path, Rect } from "react-native-svg";
import { AppIcon } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";
import type { Shipment } from "@/types/cargo";

export function DeliverySnapshot({ shipment, onPress }: { shipment: Shipment; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Open current delivery ${shipment.reference}`} accessibilityHint={`${shipment.title}. ${shipment.eta}`} onPress={onPress} activeOpacity={0.8} style={styles.card}><View style={styles.map}><Svg width="100%" height="100%" viewBox="0 0 340 126" preserveAspectRatio="none"><Rect x="0" y="0" width="340" height="126" fill="#EAF1F4" /><Path d="M-15 105 C55 78 108 95 170 58 S274 42 356 10" stroke="#FFFFFF" strokeWidth="17" fill="none" /><Path d="M-15 105 C55 78 108 95 170 58 S274 42 356 10" stroke="#D2E0E5" strokeWidth="1.2" fill="none" /><Path d="M20 15 L320 115" stroke="#FFFFFF" strokeWidth="10" /><Path d="M20 15 L320 115" stroke="#D2E0E5" strokeWidth="1" /><Path d="M75 91 C129 71 187 74 247 39" stroke={nwcColors.brandNavy} strokeWidth="3.5" strokeDasharray="7 7" fill="none" /><Circle cx="75" cy="91" r="9" fill={nwcColors.brandNavy} stroke="#FFFFFF" strokeWidth="3" /><Circle cx="247" cy="39" r="10" fill={nwcColors.primary} stroke={nwcColors.primaryInk} strokeWidth="2" /></Svg><View style={styles.mapBadge}><AppIcon name="map-marker" size={16} color={nwcColors.primaryInk} /><Text style={styles.mapBadgeText}>Live route preview</Text></View></View><View style={styles.content}><View><Text style={styles.overline}>Current delivery</Text><Text style={styles.reference}>{shipment.reference}</Text></View><View style={styles.openButton}><Text style={styles.openText}>Track</Text><AppIcon name="arrow-top-right" size={17} color={nwcColors.primaryInk} /></View></View></TouchableOpacity>;
}

const styles = StyleSheet.create({
  card: { overflow: "hidden", borderRadius: 26, borderWidth: 1, borderColor: "#E4EAED", backgroundColor: nwcColors.white },
  map: { height: 126, backgroundColor: "#EAF1F4" },
  mapBadge: { position: "absolute", left: 12, bottom: 11, flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 12, backgroundColor: nwcColors.white, paddingVertical: 7, paddingHorizontal: 9 },
  mapBadgeText: { color: nwcColors.brandNavy, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold" },
  content: { minHeight: 70, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  overline: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.7, textTransform: "uppercase" },
  reference: { color: nwcColors.foreground, fontSize: 18, lineHeight: 23, fontFamily: "Poppins_800ExtraBold", marginTop: 1 },
  openButton: { minHeight: 36, paddingHorizontal: 10, flexDirection: "row", alignItems: "center", gap: 4, borderRadius: 12, backgroundColor: nwcColors.primary },
  openText: { color: nwcColors.primaryInk, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold" },
});
