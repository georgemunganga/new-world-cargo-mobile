import { Image, StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Path, Polygon, Rect } from "react-native-svg";
import { AppIcon } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";
import type { Shipment } from "@/types/cargo";

export function LiveTrackingMap({ shipment }: { shipment: Shipment }) {
  const vehicleArtwork = shipment.service === "local" ? require("../../assets/images/services/new-world-scooter.png") : require("../../assets/images/services/new-world-truck.png");
  const routeLabel = shipment.trackingProgress?.mapLabel ?? `${shipment.pickup.city} to ${shipment.destination.city} route`;
  return <View accessibilityRole="image" accessibilityLabel={`Live tracking map. ${routeLabel}. The yellow path represents the current shipment route.`} style={styles.wrap}><Svg width="100%" height="100%" viewBox="0 0 390 328" preserveAspectRatio="none"><Rect x="0" y="0" width="390" height="328" fill="#EDF1F2" /><Polygon points="0,50 125,6 234,63 107,112" fill="#E0E6E8" /><Polygon points="111,82 255,26 390,98 242,156" fill="#E7EBEC" /><Polygon points="0,177 135,117 290,198 152,274" fill="#E2E8E9" /><Polygon points="202,173 330,113 405,155 278,218" fill="#EEF1F2" /><Path d="M-18 240 C74 203 110 178 161 192 S267 202 405 95" stroke="#FFFFFF" strokeWidth="18" fill="none" /><Path d="M-18 240 C74 203 110 178 161 192 S267 202 405 95" stroke="#D5DFE3" strokeWidth="1" fill="none" /><Path d="M42 -10 L358 335" stroke="#FFFFFF" strokeWidth="14" /><Path d="M42 -10 L358 335" stroke="#D5DFE3" strokeWidth="1" /><Path d="M-4 116 C80 89 143 136 213 122 S305 80 396 107" stroke="#FFFFFF" strokeWidth="11" fill="none" /><Path d="M-4 116 C80 89 143 136 213 122 S305 80 396 107" stroke="#D5DFE3" strokeWidth="1" fill="none" /><Rect x="52" y="56" width="41" height="51" fill="#FAFBFB" /><Rect x="62" y="44" width="41" height="62" fill="#DCE3E5" /><Rect x="152" y="75" width="55" height="59" fill="#F9FAFA" /><Rect x="272" y="49" width="52" height="63" fill="#DDE4E6" /><Rect x="299" y="202" width="48" height="57" fill="#FAFBFB" /><Rect x="172" y="220" width="59" height="55" fill={nwcColors.primary} /><Polygon points="172,220 231,220 244,211 185,211" fill="#F7D56B" /><Path d="M45 230 C97 202 111 172 159 180 S210 229 244 216" stroke={nwcColors.primary} strokeWidth="6" fill="none" /><Circle cx="45" cy="230" r="7" fill={nwcColors.brandNavy} stroke="#FFFFFF" strokeWidth="3" /></Svg><View style={styles.destinationPin}><View style={styles.pinHead}><AppIcon name="package-variant-closed" size={20} color={nwcColors.white} /></View><View style={styles.pinTip} /></View><View style={styles.vehicleMarker}><Image source={vehicleArtwork} resizeMode="contain" style={styles.vehicleArtwork} /></View><View style={styles.streetLabel}><Text style={styles.streetText}>{shipment.destination.area}</Text></View><View style={styles.mapCaption}><View style={styles.captionDot} /><Text style={styles.captionText}>Live route preview</Text></View></View>;
}

const styles = StyleSheet.create({
  wrap: { height: 328, overflow: "hidden", backgroundColor: "#EDF1F2" },
  destinationPin: { position: "absolute", left: "52%", top: 139, alignItems: "center" },
  pinHead: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.brandNavy },
  pinTip: { width: 18, height: 18, marginTop: -8, backgroundColor: nwcColors.brandNavy, transform: [{ rotate: "45deg" }], borderBottomRightRadius: 4 },
  vehicleMarker: { position: "absolute", left: "29%", top: 181, width: 70, height: 47, alignItems: "center", justifyContent: "center", borderRadius: 18, backgroundColor: "rgba(255,255,255,0.92)", borderWidth: 2, borderColor: nwcColors.primary },
  vehicleArtwork: { width: 59, height: 42 },
  streetLabel: { position: "absolute", left: 26, top: 150, borderRadius: 9, backgroundColor: "rgba(255,255,255,0.84)", paddingHorizontal: 7, paddingVertical: 4 },
  streetText: { color: "#5A6973", fontSize: 10, lineHeight: 13, fontFamily: "Poppins_600SemiBold" },
  mapCaption: { position: "absolute", left: 16, bottom: 16, flexDirection: "row", alignItems: "center", gap: 6, borderRadius: 12, paddingHorizontal: 10, paddingVertical: 8, backgroundColor: "rgba(255,255,255,0.93)" },
  captionDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: nwcColors.primary },
  captionText: { color: nwcColors.brandNavy, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold" },
});
