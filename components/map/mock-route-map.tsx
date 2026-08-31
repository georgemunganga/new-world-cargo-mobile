import { StyleSheet, Text, View } from "react-native";
import Svg, { Circle, Line, Path, Rect } from "react-native-svg";
import { AppIcon } from "@/components/ui/app-icon";
import { RouteLine } from "@/components/ui/nwc-ui";
import { describeMockRoute } from "@/lib/mock-addresses";
import { nwcColors } from "@/lib/nwc-theme";
import type { Address } from "@/types/cargo";

export function MockRouteMap({ pickup, destination }: { pickup?: Address; destination?: Address }) {
  return <View accessibilityRole="image" accessibilityLabel={describeMockRoute(pickup, destination)} style={styles.wrap}><View style={styles.mapCanvas}><Svg width="100%" height="100%" viewBox="0 0 350 190" preserveAspectRatio="none"><Rect x="0" y="0" width="350" height="190" fill="#EAF1F4" /><Path d="M-18 147 C58 112 92 130 147 100 S264 74 369 32" stroke="#FFFFFF" strokeWidth="17" fill="none" /><Path d="M-18 147 C58 112 92 130 147 100 S264 74 369 32" stroke="#D3E0E5" strokeWidth="1.4" fill="none" /><Line x1="22" y1="20" x2="320" y2="172" stroke="#FFFFFF" strokeWidth="11" /><Line x1="22" y1="20" x2="320" y2="172" stroke="#D3E0E5" strokeWidth="1.2" /><Line x1="42" y1="184" x2="302" y2="10" stroke="#FFFFFF" strokeWidth="9" /><Line x1="42" y1="184" x2="302" y2="10" stroke="#D3E0E5" strokeWidth="1.1" /><Path d="M64 130 C112 97 179 120 252 66" stroke={nwcColors.brandNavy} strokeWidth="4" strokeDasharray="7 7" fill="none" /><Circle cx="64" cy="130" r="10" fill={nwcColors.brandNavy} stroke="#FFFFFF" strokeWidth="4" /><Circle cx="252" cy="66" r="11" fill={nwcColors.primary} stroke={nwcColors.primaryInk} strokeWidth="2" /></Svg><View style={styles.mapLegend}><View style={styles.legendItem}><View style={styles.originDot} /><Text style={styles.legendText}>Pickup</Text></View><View style={styles.legendItem}><View style={styles.destinationDot} /><Text style={styles.legendText}>Delivery</Text></View></View></View><View style={styles.routeTextPanel}><View style={styles.panelLabel}><AppIcon name="text-box-outline" size={17} color={nwcColors.info} /><Text style={styles.panelLabelText}>Text route alternative</Text></View><RouteLine from={pickup ? `${pickup.area}, ${pickup.city}` : "Choose pickup"} to={destination ? `${destination.area}, ${destination.city}` : "Choose delivery"} /><Text style={styles.routeDescription}>{describeMockRoute(pickup, destination)}</Text></View></View>;
}

const styles = StyleSheet.create({
  wrap: { borderRadius: 20, overflow: "hidden", borderWidth: 1, borderColor: nwcColors.border, backgroundColor: nwcColors.surface },
  mapCanvas: { height: 190, backgroundColor: "#EAF1F4" },
  mapLegend: { position: "absolute", left: 12, bottom: 11, flexDirection: "row", gap: 8, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.92)", paddingHorizontal: 10, paddingVertical: 8 },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 5 },
  originDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: nwcColors.brandNavy },
  destinationDot: { width: 9, height: 9, borderRadius: 2, backgroundColor: nwcColors.primary, borderWidth: 1, borderColor: nwcColors.primaryInk },
  legendText: { color: nwcColors.foreground, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_700Bold" },
  routeTextPanel: { padding: 15, gap: 10 },
  panelLabel: { flexDirection: "row", alignItems: "center", gap: 6 },
  panelLabelText: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold" },
  routeDescription: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
});
