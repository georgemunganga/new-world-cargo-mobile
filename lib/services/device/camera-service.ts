import { Platform } from "react-native";
import {
  nativeSuccess,
  nativeUnavailable,
  type NativeServiceResult,
} from "./native-service-result";
import { fileService } from "./file-service";

export type PickedImage = { uri: string; name: string; type: string };

export const cameraService = {
  async pickImage(): Promise<NativeServiceResult<PickedImage>> {
    const result = await fileService.pickImage();
    if (!result.ok) return result;
    return {
      ok: true,
      value: {
        uri: result.value.uri,
        name: result.value.name,
        type: result.value.type ?? "image/jpeg",
      },
    };
  },
  async capturePhoto(): Promise<NativeServiceResult<PickedImage>> {
    if (Platform.OS === "web")
      return nativeUnavailable(
        "browser-preview",
        "Take a photo in the mobile app, or choose an existing image.",
      );
    try {
      const picker = await import("expo-image-picker");
      const permission = await picker.requestCameraPermissionsAsync();
      if (!permission.granted)
        return nativeUnavailable(
          "permission-denied",
          "Allow camera access in Settings to take a cargo photo.",
        );
      const result = await picker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.82,
      });
      if (result.canceled)
        return nativeUnavailable("cancelled", "No photo taken.");
      const asset = result.assets[0];
      if (!asset?.uri)
        return nativeUnavailable(
          "unknown",
          "We could not read the photo. Please try again.",
        );
      return nativeSuccess({
        uri: asset.uri,
        name: asset.fileName || `cargo-${Date.now()}.jpg`,
        type: asset.mimeType || "image/jpeg",
      });
    } catch {
      return nativeUnavailable(
        "unknown",
        "The camera could not open. Please try again or choose an existing photo.",
      );
    }
  },
};
