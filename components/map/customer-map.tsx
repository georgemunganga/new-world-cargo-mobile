import { useCallback, useMemo, useRef, useState } from "react";
import { PanResponder, StyleSheet, Text, TouchableOpacity, View, type StyleProp, type ViewStyle } from "react-native";
import Svg, { Circle, Path, Polygon, Rect } from "react-native-svg";

import { AppIcon } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";
import type { Address, Shipment } from "@/types/cargo";

export type CustomerMapMode = "location-picker" | "route-preview" | "live-local" | "international" | "completed";
export type MapPinPosition = "initial" | "north" | "south" | "east" | "west";

type CustomerMapProps = {
  mode: CustomerMapMode;
  pickup?: Address;
  destination?: Address;
  shipment?: Shipment;
  pickupPinPosition?: MapPinPosition;
  destinationPinPosition?: MapPinPosition;
  adjustingTarget?: "pickup" | "destination" | null;
  routeReady?: boolean;
  routeProgress?: number;
  height?: number;
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
  onZoomChange?: (zoom: number) => void;
};

const modeCopy: Record<CustomerMapMode, { label: string; accessibility: string }> = {
  "location-picker": { label: "Location picker", accessibility: "Location picker map. Use the zoom controls, drag the mock map, or pinch to inspect the route." },
  "route-preview": { label: "Route preview", accessibility: "Route preview map. Use the zoom controls, drag the mock map, or pinch to inspect the route." },
  "live-local": { label: "Live local route", accessibility: "Live local delivery map with a moving vehicle marker and delivery route." },
  international: { label: "International transit", accessibility: "International shipment map showing origin, destination, and cargo position across regions." },
  completed: { label: "Delivered route", accessibility: "Completed delivery route map showing the confirmed delivery destination." },
};

const pinOffsets: Record<MapPinPosition, { marginTop?: number; marginLeft?: number }> = { initial: {}, north: { marginTop: -20 }, south: { marginTop: 20 }, east: { marginLeft: 20 }, west: { marginLeft: -20 } };

export function CustomerMap({ mode, pickup, destination, shipment, pickupPinPosition = "initial", destinationPinPosition = "initial", adjustingTarget, routeReady = false, routeProgress, height = 328, fill = false, style, onZoomChange }: CustomerMapProps) {
  const initialZoom = mode === "international" ? 0.82 : 1;
  const [zoom, setZoom] = useState(initialZoom);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panStart = useRef({ x: 0, y: 0 });
  const pinchStart = useRef<number | null>(null);
  const zoomStart = useRef(initialZoom);
  const isInternational = mode === "international";
  const progress = Math.max(0.08, Math.min(0.93, routeProgress ?? shipment?.trackingProgress?.fraction ?? (mode === "completed" ? 1 : 0.42)));
  const copy = modeCopy[mode];
  const origin = pickup ?? shipment?.pickup;
  const endpoint = destination ?? shipment?.destination;
  const vehicleIcon = shipment?.service === "local" || mode === "live-local" ? "bike-fast" : isInternational ? "package-variant-closed" : "truck-fast-outline";
  const updateZoom = useCallback((nextZoom: number) => { const rounded = Math.round(nextZoom * 100) / 100; setZoom(rounded); onZoomChange?.(rounded); }, [onZoomChange]);
  const mapGesture = useMemo(() => PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: (_, gesture) => Math.abs(gesture.dx) > 2 || Math.abs(gesture.dy) > 2,
    onPanResponderGrant: (event) => { panStart.current = pan; const touches = event.nativeEvent.touches; if (touches.length > 1) { pinchStart.current = distance(touches[0], touches[1]); zoomStart.current = zoom; } },
    onPanResponderMove: (event, gesture) => {
      const touches = event.nativeEvent.touches;
      if (touches.length > 1 && pinchStart.current) {
        const ratio = distance(touches[0], touches[1]) / pinchStart.current;
        updateZoom(Math.max(0.7, Math.min(1.55, zoomStart.current * ratio)));
      } else if (touches.length <= 1) {
        setPan({ x: clamp(panStart.current.x + gesture.dx, -74, 74), y: clamp(panStart.current.y + gesture.dy, -52, 52) });
      }
    },
    onPanResponderRelease: () => { pinchStart.current = null; },
    onPanResponderTerminate: () => { pinchStart.current = null; },
  }), [pan, updateZoom, zoom]);
  const resetView = () => { setPan({ x: 0, y: 0 }); updateZoom(initialZoom); };
  const vehicleLeft = isInternational ? 23 + progress * 43 : 19 + progress * 44;
  const pickupLabel = origin?.area ?? "Pickup";
  const destinationLabel = endpoint?.area ?? "Destination";

  return <View accessibilityRole="image" accessibilityLabel={copy.accessibility} style={[styles.wrap, fill ? styles.fill : { height }, style]}>
    <View {...mapGesture.panHandlers} style={[styles.mapCanvas, { transform: [{ translateX: pan.x }, { translateY: pan.y }, { scale: zoom }] }]}>
      {isInternational ? <InternationalBase progress={progress} /> : <CityBase progress={progress} routeReady={routeReady || mode === "completed"} />}
      <MapMarker position={isInternational ? styles.internationalOrigin : styles.pickupMarker} offset={pinOffsets[pickupPinPosition]} icon="circle-outline" label={isInternational ? origin?.city ?? "Origin" : pickupLabel} inverse />
      <MapMarker position={isInternational ? styles.internationalDestination : styles.destinationMarker} offset={pinOffsets[destinationPinPosition]} icon={mode === "completed" ? "check" : "map-marker"} label={isInternational ? endpoint?.city ?? "Destination" : destinationLabel} />
      {mode !== "route-preview" && mode !== "location-picker" ? <View style={[styles.vehicleMarker, { left: `${vehicleLeft}%` }]}><AppIcon name={vehicleIcon} size={21} color={nwcColors.primaryInk} /></View> : null}
    </View>
    {routeReady || mode === "completed" ? <View pointerEvents="none" style={styles.readyPill}><AppIcon name={mode === "completed" ? "check-circle" : "map-marker-path"} size={17} color={mode === "completed" ? nwcColors.success : nwcColors.brandNavy} /><Text style={[styles.readyText, mode === "completed" && { color: nwcColors.success }]}>{mode === "completed" ? "Delivery confirmed" : "Route ready"}</Text></View> : null}
    {adjustingTarget ? <View pointerEvents="none" style={styles.crosshair}><View style={styles.crosshairRing}><AppIcon name="crosshairs-gps" size={29} color={nwcColors.brandNavy} /></View><Text style={styles.crosshairText}>{adjustingTarget === "pickup" ? "Pickup pin" : "Destination pin"}</Text></View> : null}
    <View style={styles.modePill}><View style={styles.modeDot} /><Text style={styles.modeText}>{copy.label}</Text></View>
    <View style={styles.zoomControls}><MapControl label="Zoom in" icon="plus" onPress={() => updateZoom(Math.min(1.55, zoom + 0.15))} /><MapControl label="Zoom out" icon="minus" onPress={() => updateZoom(Math.max(0.7, zoom - 0.15))} /><MapControl label="Reset map view" icon="crosshairs-gps" onPress={resetView} /></View>
    <View pointerEvents="none" style={styles.gestureHint}><AppIcon name="gesture-pinch" size={15} color={nwcColors.info} /><Text style={styles.gestureHintText}>Pinch or drag map</Text></View>
  </View>;
}

function CityBase({ progress, routeReady }: { progress: number; routeReady: boolean }) {
  return <Svg width="100%" height="100%" viewBox="0 0 390 328" preserveAspectRatio="none"><Rect width="390" height="328" fill="#EDF1F2" /><Polygon points="0,50 125,6 234,63 107,112" fill="#E0E6E8" /><Polygon points="111,82 255,26 390,98 242,156" fill="#E7EBEC" /><Polygon points="0,177 135,117 290,198 152,274" fill="#E2E8E9" /><Polygon points="202,173 330,113 405,155 278,218" fill="#EEF1F2" /><Path d="M-18 240 C74 203 110 178 161 192 S267 202 405 95" stroke="#FFFFFF" strokeWidth="18" fill="none" /><Path d="M-18 240 C74 203 110 178 161 192 S267 202 405 95" stroke="#D5DFE3" strokeWidth="1" fill="none" /><Path d="M42 -10 L358 335" stroke="#FFFFFF" strokeWidth="14" /><Path d="M42 -10 L358 335" stroke="#D5DFE3" strokeWidth="1" /><Path d="M45 230 C97 202 111 172 159 180 S210 229 244 216" stroke="#B4C6CD" strokeWidth="6" fill="none" /><Path d="M45 230 C97 202 111 172 159 180 S210 229 244 216" stroke={routeReady ? nwcColors.primary : "#AFC2C9"} strokeWidth="6" fill="none" strokeDasharray={`${Math.round(progress * 260)} 260`} /><Circle cx="45" cy="230" r="7" fill={nwcColors.brandNavy} stroke="#FFFFFF" strokeWidth="3" /></Svg>;
}

function InternationalBase({ progress }: { progress: number }) {
  const packageX = 84 + progress * 214;
  return <Svg width="100%" height="100%" viewBox="0 0 390 328" preserveAspectRatio="none"><Rect width="390" height="328" fill="#EAF2F5" /><Path d="M-6 52 C25 12 68 9 104 38 C130 60 163 42 176 67 C185 85 157 107 132 106 C93 104 55 123 16 103 Z" fill="#D4E0E4" /><Path d="M230 38 C264 11 319 19 351 47 C379 72 389 104 360 121 C327 141 301 111 278 119 C245 131 213 102 230 38 Z" fill="#D4E0E4" /><Path d="M140 156 C174 134 231 148 256 184 C276 214 250 256 211 252 C185 249 183 277 153 264 C124 250 120 206 140 156 Z" fill="#D4E0E4" /><Path d="M40 216 C74 193 112 211 128 243 C145 276 113 306 73 299 C41 293 15 249 40 216 Z" fill="#E0E9EB" /><Path d="M83 102 C145 64 247 69 308 117 C274 183 196 211 106 215" fill="none" stroke="#B8C8CF" strokeWidth="2.5" strokeDasharray="5 6" /><Path d="M83 102 C145 64 247 69 308 117" fill="none" stroke={nwcColors.primary} strokeWidth="4" strokeDasharray={`${Math.round(progress * 244)} 244`} /><Circle cx="83" cy="102" r="8" fill={nwcColors.brandNavy} stroke="#FFFFFF" strokeWidth="3" /><Circle cx="308" cy="117" r="9" fill={nwcColors.primary} stroke={nwcColors.primaryInk} strokeWidth="3" /><Circle cx={packageX} cy={102 - Math.sin(progress * Math.PI) * 28} r="8" fill={nwcColors.brandNavy} stroke={nwcColors.primary} strokeWidth="3" /></Svg>;
}

function MapMarker({ position, offset, icon, label, inverse = false }: { position: object; offset: object; icon: Parameters<typeof AppIcon>[0]["name"]; label: string; inverse?: boolean }) {
  return <View pointerEvents="none" style={[styles.marker, position, offset]}><View style={[styles.markerIcon, inverse && styles.markerIconInverse]}><AppIcon name={icon} size={17} color={inverse ? nwcColors.white : nwcColors.primaryInk} /></View><Text numberOfLines={1} style={styles.markerText}>{label}</Text></View>;
}

function MapControl({ label, icon, onPress }: { label: string; icon: Parameters<typeof AppIcon>[0]["name"]; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} activeOpacity={0.74} onPress={onPress} style={styles.mapControl}><AppIcon name={icon} size={20} color={nwcColors.brandNavy} /></TouchableOpacity>;
}

function distance(first: { pageX: number; pageY: number }, second: { pageX: number; pageY: number }) { return Math.hypot(second.pageX - first.pageX, second.pageY - first.pageY); }
function clamp(value: number, min: number, max: number) { return Math.max(min, Math.min(max, value)); }

const styles = StyleSheet.create({
  wrap: { overflow: "hidden", backgroundColor: "#EDF1F2" },
  fill: { ...StyleSheet.absoluteFillObject },
  mapCanvas: { ...StyleSheet.absoluteFillObject },
  pickupMarker: { left: "12%", top: "63%" }, destinationMarker: { left: "57%", top: "38%" }, internationalOrigin: { left: "11%", top: "25%" }, internationalDestination: { left: "69%", top: "29%" },
  marker: { position: "absolute", maxWidth: 114, alignItems: "center" }, markerIcon: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary, borderWidth: 2, borderColor: nwcColors.primaryInk }, markerIconInverse: { backgroundColor: nwcColors.brandNavy, borderColor: nwcColors.white }, markerText: { maxWidth: 110, marginTop: 4, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 7, overflow: "hidden", backgroundColor: "rgba(255,255,255,0.92)", color: nwcColors.foreground, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold" },
  vehicleMarker: { position: "absolute", top: "55%", width: 44, height: 44, marginLeft: -22, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.97)", borderWidth: 2, borderColor: nwcColors.primary, shadowColor: "#012642", shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.14, shadowRadius: 7, elevation: 5 },
  modePill: { position: "absolute", left: 14, top: 14, flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.95)" }, modeDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: nwcColors.primary }, modeText: { color: nwcColors.brandNavy, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold" },
  zoomControls: { position: "absolute", right: 14, top: 14, gap: 7 }, mapControl: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.97)", borderWidth: 1, borderColor: "#E5ECEE" }, gestureHint: { position: "absolute", left: 14, bottom: 14, flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 6, backgroundColor: "rgba(255,255,255,0.93)" }, gestureHintText: { color: nwcColors.info, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_700Bold" },
  readyPill: { position: "absolute", top: 55, alignSelf: "center", minHeight: 33, paddingHorizontal: 11, borderRadius: 12, backgroundColor: "rgba(255,255,255,0.96)", flexDirection: "row", alignItems: "center", gap: 5 }, readyText: { color: nwcColors.brandNavy, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold" },
  crosshair: { position: "absolute", top: "42%", left: "50%", alignItems: "center", transform: [{ translateX: -45 }] }, crosshairRing: { width: 54, height: 54, borderRadius: 27, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.96)", borderWidth: 2, borderColor: nwcColors.primary }, crosshairText: { marginTop: 5, paddingHorizontal: 9, paddingVertical: 3, borderRadius: 8, overflow: "hidden", color: nwcColors.brandNavy, backgroundColor: "rgba(255,255,255,0.96)", fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold" },
});
