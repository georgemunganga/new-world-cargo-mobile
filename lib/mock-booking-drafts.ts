import type { ServiceType } from "@/types/cargo";

export type BookingDraftService = ServiceType | "custom";
export type MockBookingDraftRecord = { id: string; service: BookingDraftService; title: string; route: string; stepLabel: string; progress: string; updatedAt: string; resumeHref: string };

export const mockBookingDraftRecords: MockBookingDraftRecord[] = [
  { id: "draft-local", service: "local", title: "Local Delivery", route: "Manda Hill → Kabulonga", stepLabel: "Add receiver", progress: "2 of 5", updatedAt: "Updated 12 min ago", resumeHref: "/local-delivery/contacts" },
  { id: "draft-import", service: "import", title: "International Import", route: "Guangzhou → Lusaka", stepLabel: "Describe cargo", progress: "2 of 5", updatedAt: "Updated yesterday", resumeHref: "/import/cargo" },
  { id: "draft-intercity", service: "intercity", title: "City-to-City", route: "Lusaka → Kitwe", stepLabel: "Add cargo", progress: "1 of 5", updatedAt: "Updated 3 days ago", resumeHref: "/intercity/cargo" },
  { id: "draft-custom", service: "custom", title: "Custom Request", route: "Lusaka → Ndola", stepLabel: "Tell us what you need", progress: "1 of 2", updatedAt: "Updated 6 days ago", resumeHref: "/custom/details" },
];

export function draftServiceColor(service: BookingDraftService) { return service === "import" ? "yellow" : service === "custom" ? "navy" : "tint"; }
