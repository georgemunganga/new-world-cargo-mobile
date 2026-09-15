import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from "react-native-svg";
import type { Region } from "react-native-maps";
import { WORLD_LAND_PATH } from "@/lib/maps/world-land-path";
import { internationalRoutePoints } from "@/lib/maps/international-route";

type Point = { latitude: number; longitude: number; label: string };
type Props = { origin: Point | null; destination: Point | null; offices: Point[]; region: Region; width: number; height: number };
const mercatorY = (latitude: number) => (0.5 - Math.log(Math.tan(Math.PI / 4 + Math.max(-85.051129, Math.min(85.051129, latitude)) * Math.PI / 360)) / (2 * Math.PI)) * 720;

export function InternationalWorldOverview({ origin, destination, offices, region, width, height }: Props) {
  const span = Math.max(0.001, region.longitudeDelta);
  const scale = width / (span * 2);
  const centerX = (region.longitude + 180) * 2;
  const centerY = mercatorY(region.latitude);
  const tx = width / 2 - centerX * scale;
  const ty = height / 2 - centerY * scale;
  const project = (point: { latitude: number; longitude: number }) => ({ x: ((point.longitude - region.longitude + 540) % 360 - 180) * 2 * scale + width / 2, y: (mercatorY(point.latitude) - centerY) * scale + height / 2 });
  const start = origin ? project(origin) : null;
  const end = destination ? project(destination) : null;
  const route = origin && destination ? internationalRoutePoints(origin, destination).map(project) : [];
  const routePath = route.map((point, index) => `${index === 0 || Math.abs(point.x - route[index - 1].x) > width / 2 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  const dotRadius = Math.max(0.65, 1.3 - Math.log2(Math.max(1, 360 / span)) * 0.09);
  return <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
    <Defs><ClipPath id="land-clip">{[-720, 0, 720].map((offset) => <Path key={offset} d={WORLD_LAND_PATH} transform={`translate(${tx + offset * scale} ${ty}) scale(${scale})`} fillRule="evenodd" />)}</ClipPath></Defs>
    <Rect width={width} height={height} fill="#FAFAF7" />
    <G clipPath="url(#land-clip)">
      <Rect width={width} height={height} fill="#F1F2EE" />
      <Path d={Array.from({ length: Math.ceil(height / 7) }, (_, row) => Array.from({ length: Math.ceil(width / 7) }, (_, col) => {
        const x = col * 7 + 3, y = row * 7 + 3, r = dotRadius;
        return `M${x-r} ${y}a${r} ${r} 0 1 0 ${2*r} 0a${r} ${r} 0 1 0 ${-2*r} 0`;
      }).join("")).join("")} fill="#7E8788" />
    </G>
    {start && end ? <Path d={routePath} fill="none" stroke="#FFCD3C" strokeWidth={4} strokeLinecap="round" /> : null}
    {offices.filter((p) => ![origin, destination].some((selected) => selected?.latitude === p.latitude && selected.longitude === p.longitude)).map((office) => { const p = project(office); return <Pin key={`${office.latitude}:${office.longitude}:${office.label}`} x={p.x} y={p.y} color="#123C50" />; })}
    {start ? <Pin {...start} color="#123C50" /> : null}
    {end ? <Pin {...end} color="#FFCD3C" /> : null}
  </Svg>;
}
function Pin({ x, y, color }: { x: number; y: number; color: string }) {
  return <G transform={`translate(${x} ${y})`}><Path d="M0 0 C-3 -5 -10 -10 -10 -17 A10 10 0 1 1 10 -17 C10 -10 3 -5 0 0Z" fill={color} stroke="white" strokeWidth={2} /><Circle cy={-17} r={3} fill="white" /></G>;
}
