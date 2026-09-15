type GeocodedPlace = { city?: string | null; district?: string | null; street?: string | null; streetNumber?: string | null; name?: string | null };
export function readablePlaceLabel(address: GeocodedPlace, fallback = "Selected location") {
  const readable = (value?: string | null) => value && !/[23456789CFGHJMPQRVWX]{2,8}\+[23456789CFGHJMPQRVWX]{2,}/i.test(value) ? value.trim() : "";
  const street = readable(address.street);
  const name = street ? [address.streetNumber, street].filter(Boolean).join(" ") : readable(address.name);
  return name || [fallback, readable(address.district) || address.city].filter(Boolean).join(", ");
}
