import { nativeUnavailable, type NativeServiceResult } from "./native-service-result";
import { fileService } from "./file-service";

export type ScanResult = { value: string; format?: string };
export type PickedImage = { uri: string; name: string; type: string };

export const cameraService = {
  async scanQrCode(): Promise<NativeServiceResult<ScanResult>> {
    return nativeUnavailable("missing-native-module", "Camera scanning is ready at the app seam. Add the native camera scanner module before production builds.");
  },
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
    return nativeUnavailable("missing-native-module", "Camera capture is ready at the app seam. Add the native camera module before production builds.");
  },
};
