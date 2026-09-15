import { Platform, Text, View, type StyleProp, type ViewStyle } from "react-native";
import { useMemo } from "react";
import { NativeMapSurface } from "@/components/map/native-map-surface";
import { deliveryMapProfileFor, type DeliveryMapService } from "@/lib/domain/delivery-map";
import type { Address, Shipment } from "@/types/cargo";

export type CustomerMapMode = "location-picker" | "route-preview" | "live-local" | "international" | "completed";
export type MapPinPosition = "initial" | "north" | "south" | "east" | "west";
type Props = {
  mode: CustomerMapMode; pickup?: Address; destination?: Address; overviewPoints?: Address[]; shipment?: Shipment;
  deliveryService?: DeliveryMapService; pickupPinPosition?: MapPinPosition; destinationPinPosition?: MapPinPosition;
  adjustingTarget?: "pickup" | "destination" | null; routeReady?: boolean; routeProgress?: number;
  height?: number; fill?: boolean; style?: StyleProp<ViewStyle>; onZoomChange?: (zoom: number) => void;
};
export function CustomerMap({ mode, pickup, destination, overviewPoints = [], shipment, deliveryService, routeProgress, height = 328, fill = false, style, onZoomChange }: Props) {
  const service = deliveryService ?? shipment?.service;
  const profile = deliveryMapProfileFor(service, mode);
  const origin = useMemo(() => coordinate(pickup ?? shipment?.pickup), [pickup, shipment?.pickup]);
  const endpoint = useMemo(() => coordinate(destination ?? shipment?.destination), [destination, shipment?.destination]);
  if (Platform.OS === "web") return <View style={[{ height, justifyContent: "center", alignItems: "center", backgroundColor: "#F3F5F5" }, style]}><Text>Open the mobile app to explore the map.</Text></View>;
  return <NativeMapSurface origin={origin} destination={endpoint}
    overviewPoints={overviewPoints.flatMap((point) => { const value = coordinate(point); return value ? [value] : []; })}
    progress={routeProgress ?? shipment?.trackingProgress?.fraction ?? 0} completed={mode === "completed"}
    restrictToZambia={service === "local" || mode === "live-local"}
    routeMode={profile.routeStyle === "international" ? "direct" : "road"}
    height={height} fill={fill} style={style as object} onZoomChange={onZoomChange} />;
}
function coordinate(address?: Address) {
  if (!address || !Number.isFinite(address.latitude) || !Number.isFinite(address.longitude)) return null;
  return { latitude: address.latitude as number, longitude: address.longitude as number, label: address.label || address.detail || address.city };
}
