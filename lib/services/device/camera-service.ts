export type ScanResult = { value: string; format?: string };

export const cameraService = {
  async scanQrCode(): Promise<ScanResult | null> {
    return null;
  },
};
