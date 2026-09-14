import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, type Region } from "react-native-maps";

import { AppIcon } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";
import { computeGoogleRoadRoute, type MapCoordinate } from "@/lib/services/maps/google-routes-service";
import type { NativeMapSurfaceProps } from "./native-map-surface";

const fallbackRegion: Region = { latitude: -15.3875, longitude: 28.3228, latitudeDelta: 0.2, longitudeDelta: 0.2 };

export function NativeMapSurface({ origin, destination, progress, completed, routeMode = "road", height = 328, fill = false, style, onZoomChange }: NativeMapSurfaceProps) {
  const map = useRef<MapView>(null);
  const coordinates = useMemo(() => [origin, destination].filter((point): point is NonNullable<typeof point> => Boolean(point)), [destination, origin]);
  const region = useMemo(() => regionFor(coordinates), [coordinates]);
  const [routeCoordinates, setRouteCoordinates] = useState<MapCoordinate[]>(coordinates);

  useEffect(() => {
    let mounted = true;
    if (!origin || !destination || routeMode === "direct") {
      setRouteCoordinates(coordinates);
      return () => { mounted = false; };
    }
    void computeGoogleRoadRoute(origin, destination)
      .then((route) => { if (mounted) setRouteCoordinates(route); })
      .catch(() => { if (mounted) setRouteCoordinates([origin, destination]); });
    return () => { mounted = false; };
  }, [origin, destination, routeMode]);

  useEffect(() => {
    if (coordinates.length > 1) map.current?.fitToCoordinates(coordinates, { edgePadding: { top: 76, right: 54, bottom: 76, left: 54 }, animated: true });
    else if (coordinates[0]) map.current?.animateToRegion({ ...coordinates[0], latitudeDelta: 0.08, longitudeDelta: 0.08 }, 350);
  }, [coordinates]);

  const zoomBy = (factor: number) => {
    map.current?.getCamera().then((camera) => {
      const nextZoom = Math.max(2, Math.min(20, (camera.zoom ?? 12) + factor));
      map.current?.animateCamera({ zoom: nextZoom }, { duration: 250 });
      onZoomChange?.(nextZoom);
    });
  };

  return <View accessibilityRole="image" accessibilityLabel="Interactive shipment route map. Drag or pinch to inspect locations." style={[styles.wrap, fill ? styles.fill : { height }, style]}>
    <MapView ref={map} provider={PROVIDER_GOOGLE} style={StyleSheet.absoluteFill} initialRegion={region} showsUserLocation showsMyLocationButton toolbarEnabled={false} onRegionChangeComplete={(_, details) => details?.isGesture && map.current?.getCamera().then((camera) => onZoomChange?.(camera.zoom ?? 0))}>
      {origin ? <Marker coordinate={origin} title={origin.label} pinColor={nwcColors.brandNavy} /> : null}
      {destination ? <Marker coordinate={destination} title={destination.label} pinColor={completed ? nwcColors.success : nwcColors.primary} /> : null}
      {origin && destination ? <Polyline coordinates={routeCoordinates} strokeColor={completed ? nwcColors.success : nwcColors.primary} strokeWidth={5} lineDashPattern={progress < 1 ? [14, 8] : undefined} /> : null}
    </MapView>
    <View style={styles.controls}>
      <MapButton label="Zoom in" icon="plus" onPress={() => zoomBy(1)} />
      <MapButton label="Zoom out" icon="minus" onPress={() => zoomBy(-1)} />
      <MapButton label="Fit route" icon="crosshairs-gps" onPress={() => coordinates.length > 1 ? map.current?.fitToCoordinates(coordinates, { edgePadding: { top: 76, right: 54, bottom: 76, left: 54 }, animated: true }) : map.current?.animateToRegion(region, 300)} />
    </View>
    <View pointerEvents="none" style={styles.hint}><AppIcon name="gesture-pinch" size={15} color={nwcColors.info} /><Text style={styles.hintText}>Pinch, drag or use controls</Text></View>
  </View>;
}

function regionFor(points: { latitude: number; longitude: number }[]): Region {
  if (!points.length) return fallbackRegion;
  if (points.length === 1) return { ...points[0], latitudeDelta: 0.08, longitudeDelta: 0.08 };
  const latitudes = points.map((point) => point.latitude);
  const longitudes = points.map((point) => point.longitude);
  const minLat = Math.min(...latitudes); const maxLat = Math.max(...latitudes);
  const minLng = Math.min(...longitudes); const maxLng = Math.max(...longitudes);
  return { latitude: (minLat + maxLat) / 2, longitude: (minLng + maxLng) / 2, latitudeDelta: Math.max(0.08, (maxLat - minLat) * 1.45), longitudeDelta: Math.max(0.08, (maxLng - minLng) * 1.45) };
}

function MapButton({ label, icon, onPress }: { label: string; icon: "plus" | "minus" | "crosshairs-gps"; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} onPress={onPress} style={styles.button}><AppIcon name={icon} size={20} color={nwcColors.brandNavy} /></TouchableOpacity>;
}

const styles = StyleSheet.create({
  wrap: { position: "relative", overflow: "hidden", borderRadius: 24, backgroundColor: "#EAF0F2" },
  fill: { ...StyleSheet.absoluteFillObject, borderRadius: 0 },
  controls: { position: "absolute", right: 14, top: 14, gap: 7 },
  button: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.97)", borderWidth: 1, borderColor: "#E5ECEE" },
  hint: { position: "absolute", left: 14, bottom: 14, flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 6, backgroundColor: "rgba(255,255,255,0.93)" },
  hintText: { color: nwcColors.info, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_700Bold" },
});
