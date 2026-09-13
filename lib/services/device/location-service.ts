export type DeviceLocation = {
  latitude: number;
  longitude: number;
  accuracy?: number;
};

export const locationService = {
  async getCurrentLocation(): Promise<DeviceLocation | null> {
    return null;
  },
};
