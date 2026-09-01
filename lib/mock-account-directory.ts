export type MockDirectoryKind = "places" | "recipients";
export type MockDirectoryItem = { id: string; label: string; detail: string };

export const mockSavedPlaces: MockDirectoryItem[] = [
  { id: "place-home", label: "Home", detail: "Roma, Lusaka" },
  { id: "place-work", label: "Work", detail: "Arcades, Lusaka" },
];

export const mockRecipients: MockDirectoryItem[] = [
  { id: "recipient-john", label: "John Banda", detail: "Lusaka · 097 220 1448" },
  { id: "recipient-amara", label: "Amara Ndlovu", detail: "Kitwe · 096 806 0205" },
];
