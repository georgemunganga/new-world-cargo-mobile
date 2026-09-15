export function isPickupTimeValid(value?: string, now = Date.now()) {
  return Boolean(value && Number.isFinite(Date.parse(value)) && Math.floor(Date.parse(value) / 60000) >= Math.floor(now / 60000));
}
export function pickupTimeLabel(value: string) {
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date.toLocaleString([], { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) : "Choose date and time";
}
