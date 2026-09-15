import { MapLoadingOverlay } from "./map-loading-overlay";
import { Skeleton, SkeletonGroup } from "@/components/ui/skeleton";
import { BrandedMapPin } from "./branded-map-pin";
import { brandMapStyle } from "@/lib/maps/brand-map-style";
import { useEffect, useRef, useState } from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { IconButton, PrimaryButton } from "@/components/ui/nwc-ui";
import { locationService, type DeviceLocation } from "@/lib/services/device/location-service";
import { isInLocalCity } from "@/lib/maps/local-city";
import { nwcColors } from "@/lib/nwc-theme";
import type { Address } from "@/types/cargo";
import type { LocalLocationPickerProps } from "./local-location-picker";

export function LocalLocationPicker({ city, initial, target, onClose, onConfirm }: LocalLocationPickerProps) {
  const insets = useSafeAreaInsets();
  const map = useRef<MapView>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapAttempt, setMapAttempt] = useState(0);
  const moving = useRef(false);
  const requestVersion = useRef(0);
  const [point, setPoint] = useState<DeviceLocation>(isInLocalCity(initial, city) ? { latitude: initial!.latitude!, longitude: initial!.longitude! } : city);
  const initialPoint = useRef(point);
  const [address, setAddress] = useState<Address>();
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState("");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    const version = ++requestVersion.current;
    setBusy(true); setAddress(undefined); setError("");
    const timeout = setTimeout(() => { if (active && !moving.current && version === requestVersion.current) { active = false; setBusy(false); setError("Address lookup timed out. Try again."); } }, 15000);
    const timer = setTimeout(() => { void locationService.addressForCoordinate(point).then((next) => {
      if (!active || moving.current || version !== requestVersion.current) return;
      if (!isInLocalCity(next, city)) throw new Error(`This pin is identified as ${next.cityDistrict || next.city}. Move it into ${city.city} for local delivery.`);
      setAddress(next);
    }).catch((err) => { if (active && !moving.current && version === requestVersion.current) setError(err instanceof Error ? err.message : "Unable to find this address."); })
      .finally(() => { clearTimeout(timeout); if (active && !moving.current && version === requestVersion.current) setBusy(false); }); }, 350);
    return () => { active = false; clearTimeout(timer); clearTimeout(timeout); };
  }, [point, city, retry]);
  const movePin = (next: DeviceLocation) => { moving.current = false; setBusy(true); setAddress(undefined); setPoint({ latitude: next.latitude, longitude: next.longitude }); };
  return <Modal visible animationType="slide" onRequestClose={onClose}><View style={styles.page}>
    <View style={[styles.header, { paddingTop: insets.top + 12 }]}><IconButton label="Cancel map selection" icon="arrow-left" onPress={onClose} /><Text style={styles.title}>{target === "pickup" ? "Pickup location" : "Delivery location"}</Text></View>
    <View style={styles.map}><MapView key={mapAttempt} onMapLoaded={() => setMapLoaded(true)} ref={map} provider={PROVIDER_GOOGLE} customMapStyle={brandMapStyle} style={StyleSheet.absoluteFill} initialRegion={{ ...point, latitudeDelta: 0.025, longitudeDelta: 0.025 }} onMapReady={() => map.current?.animateCamera({ center: { latitude: initialPoint.current.latitude, longitude: initialPoint.current.longitude }, zoom: 15 }, { duration: 250 })} minZoomLevel={9} toolbarEnabled={false} rotateEnabled={false} pitchEnabled={false}
      onRegionChange={() => { if (!moving.current) { moving.current = true; requestVersion.current += 1; setBusy(true); setAddress(undefined); setError(""); } }}
      onRegionChangeComplete={movePin} />
      <MapLoadingOverlay key={mapAttempt} ready={mapLoaded} onRetry={() => {setMapLoaded(false); setMapAttempt(n => n + 1);}} />
      <View pointerEvents="none" style={styles.centerPin}><BrandedMapPin /></View>
      <View style={styles.controls}><IconButton label="Zoom in" icon="plus" onPress={() => { void map.current?.getCamera().then((camera) => map.current?.animateCamera({ zoom: Math.min(20, (camera.zoom ?? 14) + 1) })); }} /><IconButton label="Zoom out" icon="minus" onPress={() => { void map.current?.getCamera().then((camera) => map.current?.animateCamera({ zoom: Math.max(9, (camera.zoom ?? 14) - 1) })); }} /><IconButton label="Return to my location" icon="crosshairs-gps" onPress={() => map.current?.animateCamera({ center: city, zoom: 15 })} /></View>
    </View>
    <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 20) }]}><Text style={styles.hint}>Move the map to place the pin.</Text>{busy ? <SkeletonGroup label="Finding selected address"><Skeleton style={{height:22,width:"85%"}} /></SkeletonGroup> : <Text accessibilityLiveRegion="polite" style={styles.address}>{error || address?.detail}</Text>}<PrimaryButton label={error ? "Retry address lookup" : "Confirm location"} disabled={busy || (!error && !address)} onPress={() => { if (error) setRetry((v) => v + 1); else if (address) onConfirm(address); }} /></View>
  </View></Modal>;
}
const styles = StyleSheet.create({ page: { flex: 1, backgroundColor: "white" }, header: { flexDirection: "row", alignItems: "center", gap: 12, padding: 16 }, title: { fontSize: 23, fontFamily: "Poppins_700Bold", color: nwcColors.brandNavy }, map: { flex: 1 }, centerPin: { position: "absolute", left: "50%", top: "50%", marginLeft: -26, marginTop: -59 }, controls: { position: "absolute", right: 16, top: 16, gap: 8 }, footer: { padding: 20, gap: 12, borderTopLeftRadius: 28, borderTopRightRadius: 28, backgroundColor: nwcColors.surfaceAccent }, hint: { color: nwcColors.muted, fontSize: 14 }, address: { fontSize: 17, color: nwcColors.foreground, fontFamily: "Poppins_600SemiBold" } });
