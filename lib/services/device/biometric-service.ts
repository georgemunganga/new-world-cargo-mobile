import { nativeUnavailable, type NativeServiceResult } from "./native-service-result";

export const biometricService = {
  async isAvailable(): Promise<NativeServiceResult<{ available: boolean }>> {
    return nativeUnavailable("missing-native-module", "Biometric unlock is ready at the app seam. Add the native local-authentication module before production builds.");
  },
  async authenticate(): Promise<NativeServiceResult<{ authenticated: boolean }>> {
    return nativeUnavailable("missing-native-module", "Biometric authentication is ready at the app seam. Add the native local-authentication module before production builds.");
  },
};
