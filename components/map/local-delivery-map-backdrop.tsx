import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { AppIcon } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";
import type { Address } from "@/types/cargo";

export function LocalDeliveryMapBackdrop({ pickup, destination }: { pickup?: Address; destination?: Address }) {
  const pickupLabel = pickup?.area ?? "Choose pickup";
  const destinationLabel = destination?.area ?? "Choose destination";
  return <View accessibilityRole="image" accessibilityLabel={`Map showing pickup ${pickupLabel} and destination ${destinationLabel}`} style={styles.canvas}><Svg width="100%" height="100%" viewBox="0 0 390 760" preserveAspectRatio="xMidYMid slice"><Rect width="390" height="760" fill="#EAF0F1" /><Path d="M-20 135 C65 115 108 174 175 142 S282 77 425 123" fill="none" stroke="#FFFFFF" strokeWidth="22" /><Path d="M-20 135 C65 115 108 174 175 142 S282 77 425 123" fill="none" stroke="#D6E0E2" strokeWidth="1.3" /><Path d="M-12 452 C55 414 129 439 188 402 S293 304 410 336" fill="none" stroke="#FFFFFF" strokeWidth="18" /><Path d="M-12 452 C55 414 129 439 188 402 S293 304 410 336" fill="none" stroke="#D6E0E2" strokeWidth="1.3" /><Line x1="30" y1="-20" x2="345" y2="704" stroke="#FFFFFF" strokeWidth="14" /><Line x1="30" y1="-20" x2="345" y2="704" stroke="#D6E0E2" strokeWidth="1.3" /><Line x1="351" y1="10" x2="20" y2="718" stroke="#FFFFFF" strokeWidth="12" /><Line x1="351" y1="10" x2="20" y2="718" stroke="#D6E0E2" strokeWidth="1.2" /><Path d="M84 388 C126 350 177 392 225 329 S279 238 316 194" fill="none" stroke={nwcColors.primary} strokeWidth="5" strokeLinecap="round" /><Circle cx="84" cy="388" r="10" fill={nwcColors.brandNavy} stroke="#FFFFFF" strokeWidth="4" /><Circle cx="316" cy="194" r="12" fill={nwcColors.primary} stroke={nwcColors.primaryInk} strokeWidth="3" /></Svg><MapMarker style={styles.pickupMarker} icon="circle-outline" label={pickupLabel} inverse /><MapMarker style={styles.destinationMarker} icon="map-marker" label={destinationLabel} /></View>;
}

function MapMarker({ icon, label, inverse, style }: { icon: "circle-outline" | "map-marker"; label: string; inverse?: boolean; style: object }) {
  return <View style={[styles.marker, style]}><View style={[styles.markerIcon, inverse ? styles.markerIconNavy : styles.markerIconYellow]}><AppIcon name={icon} size={18} color={inverse ? nwcColors.white : nwcColors.primaryInk} /></View><Text numberOfLines={1} style={styles.markerText}>{label}</Text></View>;
}

const styles = StyleSheet.create({
  canvas: { ...StyleSheet.absoluteFillObject, overflow: "hidden", backgroundColor: "#EAF0F1" },
  marker: { position: "absolute", flexDirection: "row", alignItems: "center", gap: 6, maxWidth: 155, borderRadius: 16, padding: 5, paddingRight: 9, backgroundColor: "rgba(255,255,255,0.95)" },
  pickupMarker: { top: "47%", left: "13%" },
  destinationMarker: { top: "20%", right: "10%" },
  markerIcon: { width: 30, height: 30, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  markerIconNavy: { backgroundColor: nwcColors.brandNavy },
  markerIconYellow: { backgroundColor: nwcColors.primary },
  markerText: { flexShrink: 1, color: nwcColors.foreground, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold" },
});
