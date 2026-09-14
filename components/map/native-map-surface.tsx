import type { ComponentProps } from "react";

export type NativeMapSurfaceProps = {
  origin: { latitude: number; longitude: number; label: string } | null;
  destination: { latitude: number; longitude: number; label: string } | null;
  progress: number;
  completed: boolean;
  routeMode?: "road" | "direct";
  height?: number;
  fill?: boolean;
  style?: ComponentProps<"div">["style"] | object;
  onZoomChange?: (zoom: number) => void;
};

// Web and unsupported targets keep using the existing schematic map.
export function NativeMapSurface(_props: NativeMapSurfaceProps) {
  return null;
}
