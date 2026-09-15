import { MapSkeleton } from "@/components/ui/skeleton";
import { BrandedMapPin } from "./branded-map-pin";
import { brandMapStyle } from "@/lib/maps/brand-map-style";
import { locationService } from "@/lib/services/device/location-service";
import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, type Region } from "react-native-maps";

import { AppIcon } from "@/components/ui/app-icon";
import { InternationalWorldOverview } from "@/components/map/international-world-overview";
import { nwcColors } from "@/lib/nwc-theme";
import { computeGoogleRoadRoute, type MapCoordinate } from "@/lib/services/maps/google-routes-service";
import type { NativeMapSurfaceProps } from "./native-map-surface";
import { internationalRoutePoints } from "@/lib/maps/international-route";

const fallbackRegion: Region = { latitude: -13.25, longitude: 27.8, latitudeDelta: 11, longitudeDelta: 13 };
const internationalOverviewRegion: Region = { latitude: 0, longitude: 0, latitudeDelta: 170, longitudeDelta: 350 };
const internationalWorldCamera = { center: { latitude: 0, longitude: 0 }, heading: 0, pitch: 0, zoom: 1.35, altitude: 24_000_000 };
const googleFadeStartZoom = 6.25;
const googleFadeEndZoom = 7.75;
export function NativeMapSurface({ showControls = true, requestCurrentLocation = true, origin, destination, overviewPoints = [], restrictToZambia = false, routeMode = "road", height = 328, fill = false, style, onZoomChange }: NativeMapSurfaceProps) {
  const map = useRef<MapView>(null);
  const [currentLocation, setCurrentLocation] = useState<MapCoordinate>();
  const [mapReady, setMapReady] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [tilesReady, setTilesReady] = useState(false);
  const [mapSlow, setMapSlow] = useState(false);
  const [mapAttempt, setMapAttempt] = useState(0);
  const loadingOpacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    if (tilesReady) { Animated.timing(loadingOpacity, {toValue:0, duration:250, useNativeDriver:true}).start(({finished}) => {if(finished) setShowSkeleton(false);}); return; }
    const timeout = setTimeout(() => setMapSlow(true), 15000);
    return () => clearTimeout(timeout);
  }, [tilesReady, mapAttempt, loadingOpacity]);
  const international = routeMode === "direct";
  useEffect(() => {
    if (international || !requestCurrentLocation) return;
    let active = true;
    void locationService.getCurrentLocation().then((result) => { if (active && result.ok) setCurrentLocation(result.value); }).catch(() => {});
    return () => { active = false; };
  }, [international, requestCurrentLocation]);
  const coordinates = useMemo(() => [origin, destination].filter((point): point is NonNullable<typeof point> => Boolean(point)), [destination, origin]);
  const region = useMemo(() => regionFor(coordinates, international), [coordinates, international]);
  const selectedRoute = useMemo(() => origin && destination ? internationalRoutePoints(origin, destination) : [], [origin, destination]);
  const selectionKey = coordinates.map((point) => `${point.latitude}:${point.longitude}`).join("|");
  const lastFramedSelection = useRef("");
  const visibleOffices = origin || destination ? [] : overviewPoints;
  const [routeCoordinates, setRouteCoordinates] = useState<MapCoordinate[]>(coordinates);
  const [roadRouteUnavailable, setRoadRouteUnavailable] = useState(false);
  const [showDetailedMap, setShowDetailedMap] = useState(!international);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  const [worldRegion, setWorldRegion] = useState<Region>(internationalOverviewRegion);
  const overviewOpacity = useRef(new Animated.Value(international ? 1 : 0)).current;
  const worldZoom = 0;
  const initialCameraZoom = useRef<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setRoadRouteUnavailable(false);
    if (!origin || !destination || routeMode === "direct") {
      setRouteCoordinates(coordinates);
      return () => { mounted = false; };
    }
    setRouteCoordinates([]);
    void computeGoogleRoadRoute(origin, destination)
      .then((route) => { if (mounted) setRouteCoordinates(route); })
      .catch(() => { if (mounted) { setRouteCoordinates([]); setRoadRouteUnavailable(true); } });
    return () => { mounted = false; };
  }, [coordinates, origin, destination, routeMode]);

  useEffect(() => {
    if (!mapReady || international || selectionKey === lastFramedSelection.current) return;
    lastFramedSelection.current = selectionKey;
    if (coordinates.length > 1) map.current?.fitToCoordinates(coordinates, { edgePadding: { top: 80, right: 54, bottom: 45, left: 54 }, animated: true });
    else if (coordinates[0] && !international) map.current?.animateToRegion({ ...coordinates[0], latitudeDelta: 0.22, longitudeDelta: 0.22 }, 350);
  }, [coordinates, international, mapReady, selectionKey]);

  useEffect(() => {
    if (!international || !mapReady || !selectionKey || lastFramedSelection.current === selectionKey) return;
    lastFramedSelection.current = selectionKey;
    if (coordinates.length === 2) {
      map.current?.fitToCoordinates(selectedRoute, { edgePadding: { top: 100, right: 55, bottom: 45, left: 35 }, animated: true });
    } else {
      map.current?.animateCamera({ center: coordinates[0], zoom: 5 }, { duration: 650 });
    }
  }, [coordinates, international, mapReady, selectedRoute, selectionKey]);

  const handleZoomChange = () => {
    void map.current?.getCamera().then((camera) => {
      const zoom = camera.zoom ?? 0;
      if (international) updateMapDetail(zoom);
      onZoomChange?.(zoom);
    });
  };

  const updateMapDetail = (zoom: number) => {
    const fadeProgress = Math.max(0, Math.min(1, (zoom - googleFadeStartZoom) / (googleFadeEndZoom - googleFadeStartZoom)));
    Animated.timing(overviewOpacity, { toValue: 1 - fadeProgress, duration: 220, useNativeDriver: true }).start();
    const detailed = zoom >= googleFadeStartZoom;
    setShowDetailedMap((current) => current === detailed ? current : detailed);
  };

  const handleOverviewRegionChange = (nextRegion: Region) => {
    if (!international || !viewport.width) return;
    void map.current?.getCamera().then((camera) => {
      const zoom = camera.zoom ?? 0;
      initialCameraZoom.current ??= zoom;
      const baseSpan = viewport.width * 360 / (256 * Math.pow(2, initialCameraZoom.current));
      const correction = Math.max(1, 360 / baseSpan);
      const correctionWeight = Math.max(0, 1 - (zoom - initialCameraZoom.current) / Math.max(1, googleFadeStartZoom - initialCameraZoom.current));
      const longitudeDelta = Math.min(360, viewport.width * 360 / (256 * Math.pow(2, zoom)) * Math.pow(correction, correctionWeight));
      setWorldRegion({ ...nextRegion, ...camera.center, longitudeDelta });
      const blend = Math.max(0, Math.min(1, (zoom - googleFadeStartZoom) / (googleFadeEndZoom - googleFadeStartZoom)));
      overviewOpacity.setValue(1 - blend);
      setShowDetailedMap(zoom >= googleFadeStartZoom);
    });

  };

  const zoomBy = (factor: number) => {
    map.current?.getCamera().then((camera) => {
      const nextZoom = Math.max(international ? worldZoom : 2, Math.min(20, (camera.zoom ?? 12) + factor));
      map.current?.animateCamera({ zoom: nextZoom }, { duration: 250 });

      onZoomChange?.(nextZoom);
    });
  };

  const resetInternationalOverview = () => {
    map.current?.animateCamera({ ...internationalWorldCamera, zoom: worldZoom }, { duration: 280 });
  };

  const fitMap = () => {
    if (international && coordinates.length < 2) {
      resetInternationalOverview();
      return;
    }
    if (coordinates.length > 1) {
      map.current?.fitToCoordinates(international ? selectedRoute : coordinates, { edgePadding: { top: 100, right: 55, bottom: 45, left: 35 }, animated: true });
      return;
    }
    map.current?.animateToRegion(region, 300);
  };

  return <View accessibilityRole="image" accessibilityLabel="Interactive shipment route map. Drag or pinch to inspect locations." onLayout={(event) => setViewport(event.nativeEvent.layout)} style={[styles.wrap, fill ? [styles.fill, { bottom: "57%" }] : { height }, style]}>
    {viewport.width > 0 ? <MapView key={mapAttempt} onMapLoaded={() => { setTilesReady(true); setMapSlow(false); }} ref={map} provider={PROVIDER_GOOGLE} customMapStyle={brandMapStyle} style={StyleSheet.absoluteFill} initialRegion={international ? undefined : region} initialCamera={international ? { ...internationalWorldCamera, zoom: worldZoom } : undefined} minZoomLevel={international ? worldZoom : restrictToZambia ? 5 : undefined} rotateEnabled={!international} pitchEnabled={!international}  showsUserLocation={false} showsMyLocationButton={false} toolbarEnabled={false} onMapReady={() => { setMapReady(true); if (restrictToZambia) map.current?.setMapBoundaries({ latitude: -8.2, longitude: 33.7 }, { latitude: -18.1, longitude: 21.9 }); if (international && !coordinates.length) resetInternationalOverview(); else handleZoomChange(); }} onRegionChange={handleOverviewRegionChange} onRegionChangeComplete={(nextRegion) => { handleOverviewRegionChange(nextRegion); handleZoomChange(); }}>
      {international ? visibleOffices.filter((point) => !sameCoordinate(point, origin) && !sameCoordinate(point, destination)).map((point) => <Marker key={`${point.latitude}:${point.longitude}:${point.label}`} coordinate={point} title={point.label} anchor={{ x: 0.5, y: 0.92 }}><BrandedMapPin kind="office" /></Marker>) : null}
      {currentLocation && !international && !coordinates.some((p) => Math.abs(p.latitude - currentLocation.latitude) < 0.0003 && Math.abs(p.longitude - currentLocation.longitude) < 0.0003) ? <Marker coordinate={currentLocation} title="Your location" anchor={{ x: 0.5, y: 0.92 }} zIndex={1}><BrandedMapPin kind="current" /></Marker> : null}
      {origin ? <Marker coordinate={origin} title={origin.label} anchor={{ x: 0.5, y: 0.92 }}><BrandedMapPin kind="pickup" /></Marker> : null}
      {destination ? <Marker coordinate={destination} title={destination.label} anchor={{ x: 0.5, y: 0.92 }}><BrandedMapPin kind="destination" /></Marker> : null}
      {origin && destination && (international || routeCoordinates.length > 1) ? <Polyline coordinates={international ? selectedRoute : routeCoordinates} strokeColor={nwcColors.primary} strokeWidth={6} /> : null}
    </MapView> : null}
    {international ? <Animated.View pointerEvents="none" style={[styles.worldOverview, { opacity: overviewOpacity }]}>
      {viewport.width > 0 ? <InternationalWorldOverview origin={origin} destination={destination} offices={visibleOffices} region={worldRegion} width={viewport.width} height={viewport.height} /> : null}
    </Animated.View> : null}
    {showControls ? <View style={styles.controls}>
      <MapButton label="Zoom in" icon="plus" onPress={() => zoomBy(1)} />
      <MapButton label="Zoom out" icon="minus" onPress={() => zoomBy(-1)} />
      <MapButton label="Fit route" icon="crosshairs-gps" onPress={fitMap} />
    </View> : null}
    {showControls ? <View pointerEvents="none" style={styles.hint}><AppIcon name="gesture-pinch" size={15} color={nwcColors.info} /><Text style={styles.hintText}>{roadRouteUnavailable ? "Road preview unavailable. Pickup and delivery pins are shown." : international && !showDetailedMap ? "Zoom in for street map" : "Pinch, drag or use controls"}</Text></View> : null}
    {showSkeleton && !mapSlow ? <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, {opacity:loadingOpacity}]}><MapSkeleton fill /></Animated.View> : null}
    {mapSlow ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Retry loading map" onPress={() => {setMapSlow(false); setShowSkeleton(true); setMapReady(false); setTilesReady(false); loadingOpacity.setValue(1); setMapAttempt(n => n + 1);}} style={[StyleSheet.absoluteFill, {backgroundColor:"#EEF2F2", alignItems:"center", justifyContent:"center", padding:20}]}><Text style={{color:nwcColors.brandNavy}}>Map could not load. Tap to retry.</Text></TouchableOpacity> : null}
  </View>;
}

function sameCoordinate(first: { latitude: number; longitude: number }, second: { latitude: number; longitude: number } | null) {
  return Boolean(second && first.latitude === second.latitude && first.longitude === second.longitude);
}

function regionFor(points: { latitude: number; longitude: number }[], international = false): Region {
  if (!points.length) return international ? internationalOverviewRegion : fallbackRegion;
  if (points.length === 1) return international ? internationalOverviewRegion : { ...points[0], latitudeDelta: 0.22, longitudeDelta: 0.22 };
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
  worldOverview: { ...StyleSheet.absoluteFillObject, backgroundColor: "#FAFAF7" },
  controls: { position: "absolute", right: 14, top: 14, gap: 7 },
  button: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.surfaceAccent, borderWidth: 1, borderColor: "#E5ECEE" },
  hint: { position: "absolute", left: 14, bottom: 14, flexDirection: "row", alignItems: "center", gap: 5, borderRadius: 11, paddingHorizontal: 9, paddingVertical: 6, backgroundColor: nwcColors.surfaceAccent },
  hintText: { color: nwcColors.brandNavy, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_700Bold" },
});





