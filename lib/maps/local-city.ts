export type LocalCity = { city: string; cityDistrict?: string; latitude: number; longitude: number };

function cityName(value: string | undefined) {
  if (!value || /\b(province|region|country)\b/i.test(value)) return "";
  return value.trim().toLowerCase().replace(/^city of\s+/, "").replace(/\s+(district|city|municipality)$/, "").replace(/\s+/g, " ");
}

export function isInLocalCity(point: { city?: string; cityDistrict?: string; latitude?: number; longitude?: number } | undefined, city: LocalCity | null | undefined) {
  if (!point || !city || !Number.isFinite(point.latitude) || !Number.isFinite(point.longitude)) return false;
  const expected = [cityName(city.city), cityName(city.cityDistrict)].filter(Boolean);
  const actual = [cityName(point.city), cityName(point.cityDistrict)].filter(Boolean);
  return actual.some((name) => expected.includes(name))
    && point.latitude! >= -18.1 && point.latitude! <= -8.2
    && point.longitude! >= 21.9 && point.longitude! <= 33.7;
}
