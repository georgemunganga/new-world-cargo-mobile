import type { AppIconName } from "@/components/ui/app-icon";

export type BookingQuickEditChoice<T extends string = string> = {
  id: T;
  title: string;
  detail: string;
  icon: AppIconName;
};

export const localScheduleEditChoices: readonly BookingQuickEditChoice<"as_soon_as_possible" | "later_today" | "scheduled">[] = [
  { id: "as_soon_as_possible", title: "As soon as possible", detail: "Use the earliest local collection window.", icon: "clock-fast" },
  { id: "later_today", title: "Later today", detail: "Choose a same-day collection preference.", icon: "calendar-clock-outline" },
  { id: "scheduled", title: "Choose another day", detail: "Request a future collection date.", icon: "calendar-outline" },
];

export const intercityFulfilmentEditChoices: readonly BookingQuickEditChoice<"collection" | "door_delivery">[] = [
  { id: "collection", title: "Collection point", detail: "Use a New WorldCargo branch handover.", icon: "storefront-outline" },
  { id: "door_delivery", title: "Door delivery", detail: "Arrange collection or delivery to the supplied address.", icon: "home-variant-outline" },
];

export const importMethodEditChoices: readonly BookingQuickEditChoice<"air" | "sea">[] = [
  { id: "air", title: "Air Freight", detail: "A faster import option for time-sensitive cargo.", icon: "airplane" },
  { id: "sea", title: "Sea Freight", detail: "A planned freight option for larger cargo moves.", icon: "ferry" },
];

export const customRequestEditChoices: readonly BookingQuickEditChoice<"cargo" | "business" | "other">[] = [
  { id: "cargo", title: "Special cargo", detail: "An item needing a tailored plan.", icon: "package-variant-closed" },
  { id: "business", title: "Business movement", detail: "A recurring or commercial route.", icon: "briefcase-outline" },
  { id: "other", title: "Other request", detail: "Something outside the usual services.", icon: "dots-horizontal-circle-outline" },
];

export function quickEditDrawerSnap(choiceCount: number): "half" | "expanded" {
  return choiceCount > 2 ? "expanded" : "half";
}
