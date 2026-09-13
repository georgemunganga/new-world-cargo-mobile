import { Platform } from "react-native";
import { nativeSuccess, nativeUnavailable, type NativeServiceResult } from "./native-service-result";

export type PickedDocument = {
  uri: string;
  name: string;
  type?: string;
  size?: number;
};

export type SaveTextFileInput = {
  filename: string;
  mimeType: string;
  text: string;
};

export function safeDownloadFilename(filename: string) {
  const cleaned = filename.trim().replace(/[^\w.\-]+/g, "-").replace(/-+/g, "-");
  return cleaned || "new-world-cargo-document.txt";
}

export const fileService = {
  async pickDocument(): Promise<NativeServiceResult<PickedDocument>> {
    return nativeUnavailable("missing-native-module", "Document picking is ready at the app seam. Add the native document picker module before production builds.");
  },
  async saveTextFile(input: SaveTextFileInput): Promise<NativeServiceResult<{ filename: string }>> {
    const filename = safeDownloadFilename(input.filename);
    if (Platform.OS === "web" && typeof document !== "undefined" && typeof Blob !== "undefined" && typeof URL !== "undefined") {
      const blob = new Blob([input.text], { type: input.mimeType });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(url);
      return nativeSuccess({ filename });
    }
    return nativeUnavailable("missing-native-module", "File saving is ready at the app seam. Add native file-system/share support before production builds.");
  },
};
