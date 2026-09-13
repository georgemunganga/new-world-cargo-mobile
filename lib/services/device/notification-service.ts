export type PushRegistration = {
  token: string;
  provider: "expo" | "apns" | "fcm";
};

export const notificationService = {
  async registerForPush(): Promise<PushRegistration | null> {
    return null;
  },
};
