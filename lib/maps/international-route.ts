type Coordinate = { latitude: number; longitude: number };
const radians = (degrees: number) => degrees * Math.PI / 180;
export function nearestReceivingBranch<T extends Coordinate & { branchId?: string; country?: string; countryCode?: string }>(branches: T[], location: Coordinate): T | undefined {
  const distance = (point: Coordinate) => {
    const lat = radians(point.latitude - location.latitude);
    const lon = radians(point.longitude - location.longitude);
    return Math.sin(lat / 2) ** 2 + Math.cos(radians(location.latitude)) * Math.cos(radians(point.latitude)) * Math.sin(lon / 2) ** 2;
  };
  return branches.filter((branch) => branch.branchId && (branch.countryCode === "ZM" || branch.country?.toLowerCase() === "zambia") && Number.isFinite(branch.latitude) && Number.isFinite(branch.longitude))
    .reduce<T | undefined>((best, branch) => !best || distance(branch) < distance(best) ? branch : best, undefined);
}

export function internationalRoutePoints(origin: Coordinate, destination: Coordinate): Coordinate[] {
  const vector = (p: Coordinate) => { const lat = radians(p.latitude), lon = radians(p.longitude); return [Math.cos(lat) * Math.cos(lon), Math.cos(lat) * Math.sin(lon), Math.sin(lat)]; };
  const a = vector(origin), b = vector(destination);
  const angle = Math.acos(Math.max(-1, Math.min(1, a.reduce((sum, value, i) => sum + value * b[i], 0))));
  if (Math.abs(Math.sin(angle)) < 0.000001) return [origin, destination];
  return Array.from({ length: 65 }, (_, i) => {
    const t = i / 64, first = Math.sin((1 - t) * angle) / Math.sin(angle), second = Math.sin(t * angle) / Math.sin(angle);
    const [x, y, z] = a.map((value, index) => first * value + second * b[index]);
    return { latitude: Math.atan2(z, Math.hypot(x, y)) * 180 / Math.PI, longitude: Math.atan2(y, x) * 180 / Math.PI };
  });
}
