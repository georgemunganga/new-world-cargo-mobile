import { View, Text } from "react-native";
import type { ComponentProps } from "react";

export type NativeMapSurfaceProps = {
  origin: { latitude: number; longitude: number; label: string } | null;
  destination: { latitude: number; longitude: number; label: string } | null;
  overviewPoints?: { latitude: number; longitude: number; label: string }[];
  showControls?: boolean;
  requestCurrentLocation?: boolean;
  progress: number;
  completed: boolean;
  restrictToZambia?: boolean;
  routeMode?: "road" | "direct";
  height?: number;
  fill?: boolean;
  style?: ComponentProps<"div">["style"] | object;
  onZoomChange?: (zoom: number) => void;
};

// Native targets provide the live map; unsupported targets explain availability.
export function NativeMapSurface(_props: NativeMapSurfaceProps) {
  return <View style={{height:_props.height ?? 328, backgroundColor:"#EEF2F2", alignItems:"center", justifyContent:"center"}}><Text>Open the mobile app to explore the map.</Text></View>;
}
