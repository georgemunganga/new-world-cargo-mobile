import { readFileSync, writeFileSync } from "node:fs";

const source = JSON.parse(readFileSync(new URL("./ne_110m_land.geojson", import.meta.url), "utf8"));

const project = ([longitude, latitude]) => {
  const radians = Math.max(-85.051129, Math.min(85.051129, latitude)) * Math.PI / 180;
  return [(longitude + 180) * 2, (0.5 - Math.log(Math.tan(Math.PI / 4 + radians / 2)) / (2 * Math.PI)) * 720];
};
const ringPath = (ring) => {
  if (!ring.length) return "";
  const points = ring.map(project);
  return `M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}${points.slice(1).map(([x, y]) => `L${x.toFixed(1)} ${y.toFixed(1)}`).join("")}Z`;
};

const path = source.features.flatMap(({ geometry }) => {
  if (geometry.type === "Polygon") return geometry.coordinates.flatMap((polygon) => ringPath(polygon));
  if (geometry.type === "MultiPolygon") return geometry.coordinates.flatMap((polygon) => polygon.map(ringPath));
  return [];
}).join("");

writeFileSync(
  new URL("../../lib/maps/world-land-path.ts", import.meta.url),
  `// Generated from Natural Earth 1:110m land data (public domain).\nexport const WORLD_LAND_PATH = ${JSON.stringify(path)};\n`,
);
console.log(`${path.length} path characters generated`);
