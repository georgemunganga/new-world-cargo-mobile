import type { AddressBookKind } from "@/lib/domain/address-book";

export type DirectoryEditorPresentation = "location-drawer" | "modal";

export function getDirectoryEditorPresentation(kind: AddressBookKind): DirectoryEditorPresentation {
  return kind === "places" ? "location-drawer" : "modal";
}
