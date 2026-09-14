import { Platform } from "react-native";
import {
  nativeSuccess,
  nativeUnavailable,
  type NativeServiceResult,
} from "./native-service-result";

export type PickedDocument = {
  uri: string;
  name: string;
  type?: string;
  size?: number;
};

export type PickedImage = PickedDocument;

export type SaveTextFileInput = {
  filename: string;
  mimeType: string;
  text: string;
};

export function safeDownloadFilename(filename: string) {
  const cleaned = filename
    .trim()
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-");
  return cleaned || "new-world-cargo-document.txt";
}

export const fileService = {
  async pickDocument(): Promise<NativeServiceResult<PickedDocument>> {
    if (Platform.OS === "web")
      return nativeUnavailable(
        "browser-preview",
        "Document picking is available in the mobile app.",
      );
    const DocumentPicker = await import("expo-document-picker");
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: [
        "application/pdf",
        "image/*",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ],
    });
    if (result.canceled)
      return nativeUnavailable("cancelled", "No document selected.");
    const asset = result.assets[0];
    if (!asset?.uri)
      return nativeUnavailable(
        "unknown",
        "We could not read that document. Please choose another file.",
      );
    return nativeSuccess({
      uri: asset.uri,
      name: asset.name ?? "Supporting document",
      type: asset.mimeType,
      size: asset.size,
    });
  },
  async pickImage(): Promise<NativeServiceResult<PickedImage>> {
    if (Platform.OS === "web")
      return nativeUnavailable(
        "browser-preview",
        "Photo picking is available in the mobile app.",
      );
    const ImagePicker = await import("expo-image-picker");
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted)
      return nativeUnavailable(
        "permission-denied",
        "Photo access is needed to choose an image.",
      );
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.82,
    });
    if (result.canceled)
      return nativeUnavailable("cancelled", "No photo selected.");
    const asset = result.assets[0];
    if (!asset?.uri)
      return nativeUnavailable(
        "unknown",
        "We could not read that photo. Please choose another image.",
      );
    return nativeSuccess({
      uri: asset.uri,
      name:
        asset.fileName ?? `Cargo photo.${asset.uri.split(".").pop() || "jpg"}`,
      type: asset.mimeType,
      size: asset.fileSize,
    });
  },
  async saveTextFile(
    input: SaveTextFileInput,
  ): Promise<NativeServiceResult<{ filename: string }>> {
    const filename = safeDownloadFilename(input.filename);
    if (
      Platform.OS === "web" &&
      typeof document !== "undefined" &&
      typeof Blob !== "undefined" &&
      typeof URL !== "undefined"
    ) {
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
    try {
      const FileSystem = await import("expo-file-system/legacy");
      const Sharing = await import("expo-sharing");
      if (!FileSystem.cacheDirectory || !(await Sharing.isAvailableAsync())) {
        return nativeUnavailable(
          "not-configured",
          "Sharing is not available on this device.",
        );
      }
      const fileUri = `${FileSystem.cacheDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(fileUri, input.text, {
        encoding: FileSystem.EncodingType.UTF8,
      });
      await Sharing.shareAsync(fileUri, {
        mimeType: input.mimeType,
        dialogTitle: `Save or share ${filename}`,
        UTI:
          input.mimeType === "application/pdf"
            ? "com.adobe.pdf"
            : "public.html",
      });
      return nativeSuccess({ filename });
    } catch {
      return nativeUnavailable(
        "unknown",
        "We could not save this document. Please try again.",
      );
    }
  },
};
