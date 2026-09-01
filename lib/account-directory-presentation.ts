import type { MockDirectoryKind } from "@/lib/mock-account-directory";

export type DirectoryEditorPresentation = "location-drawer" | "modal";

export function getDirectoryEditorPresentation(kind: MockDirectoryKind): DirectoryEditorPresentation {
  return kind === "places" ? "location-drawer" : "modal";
}
