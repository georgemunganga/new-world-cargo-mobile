import type { Address } from "@/types/cargo";
import type { LocalCity } from "@/lib/maps/local-city";
export type LocalLocationPickerProps = { city: LocalCity; initial?: Address; target: "pickup" | "destination"; onClose: () => void; onConfirm: (address: Address) => void };
export function LocalLocationPicker(_props: LocalLocationPickerProps) { return null; }
