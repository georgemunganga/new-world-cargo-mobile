import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Svg, { Path, Polygon, Rect } from "react-native-svg";
import { AppIcon } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";
import type { Shipment } from "@/types/cargo";

export function DeliverySnapshot({ shipment, onPress }: { shipment: Shipment; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Open current delivery ${shipment.reference}`} accessibilityHint={`${shipment.title}. ${shipment.eta}`} onPress={onPress} activeOpacity={0.8} style={styles.card}><View style={styles.map}><Svg width="100%" height="100%" viewBox="0 0 340 176" preserveAspectRatio="none"><Rect x="0" y="0" width="340" height="176" fill="#EEF1F2" /><Polygon points="0,79 82,35 166,80 81,126" fill="#E1E6E8" /><Polygon points="135,38 224,0 322,50 235,98" fill="#E5E9EA" /><Polygon points="135,38 224,0 224,47 135,86" fill="#D8DFE2" /><Polygon points="224,0 322,50 322,97 224,47" fill="#F9FAFA" /><Polygon points="12,106 112,60 221,112 114,165" fill="#E8ECEE" /><Path d="M-25 135 L343 32" stroke="#FFFFFF" strokeWidth="16" /><Path d="M-25 135 L343 32" stroke="#DCE2E4" strokeWidth="1" /><Path d="M29 13 L319 169" stroke="#FFFFFF" strokeWidth="13" /><Path d="M29 13 L319 169" stroke="#DCE2E4" strokeWidth="1" /><Rect x="42" y="29" width="37" height="42" fill="#F9FAFA" /><Rect x="49" y="22" width="37" height="49" fill="#DCE3E5" /><Rect x="90" y="46" width="39" height="37" fill="#F7F9F9" /><Rect x="189" y="53" width="46" height="45" fill="#DDE3E5" /><Rect x="244" y="82" width="40" height="45" fill="#FAFBFB" /><Rect x="146" y="83" width="53" height="44" fill={nwcColors.primary} /><Polygon points="146,83 199,83 213,75 160,75" fill="#F7D56B" /><Path d="M86 123 C126 105 174 102 221 82" stroke={nwcColors.brandNavy} strokeWidth="3" strokeDasharray="6 6" fill="none" /></Svg><View style={styles.locationPin}><AppIcon name="home" size={20} color={nwcColors.white} style={styles.pinIcon} /></View><View style={styles.expandButton}><AppIcon name="arrow-top-right" size={23} color={nwcColors.brandNavy} /></View><View style={styles.shipmentOverlay}><Text style={styles.overlayLabel}>Active shipment</Text><View style={styles.overlayDot} /><Text style={styles.overlayReference}>{shipment.reference.replace("NWC-", "NT-")}</Text></View></View></TouchableOpacity>;
}

const styles = StyleSheet.create({
  card: { overflow: "hidden", borderRadius: 26, backgroundColor: "#EEF1F2" },
  map: { height: 176, backgroundColor: "#EEF1F2" },
  locationPin: { position: "absolute", left: "46%", top: 47, width: 48, height: 54, borderRadius: 24, borderBottomLeftRadius: 8, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.brandNavy, transform: [{ rotate: "45deg" }] },
  pinIcon: { transform: [{ rotate: "-45deg" }] },
  expandButton: { position: "absolute", right: 12, top: 12, height: 42, width: 42, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.white },
  shipmentOverlay: { position: "absolute", left: 13, bottom: 13, minHeight: 43, borderRadius: 14, backgroundColor: nwcColors.white, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 7 },
  overlayLabel: { color: nwcColors.foreground, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_500Medium" },
  overlayDot: { height: 4, width: 4, borderRadius: 2, backgroundColor: nwcColors.muted },
  overlayReference: { color: nwcColors.foreground, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold" },
});
