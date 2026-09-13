import { Platform } from "react-native";
import * as Haptics from "expo-haptics";

export type HapticIntent = "selection" | "light-impact" | "success" | "warning" | "error";

export const hapticService = {
  async notify(intent: HapticIntent) {
    if (Platform.OS === "web") return;
    if (intent === "selection") {
      await Haptics.selectionAsync();
      return;
    }
    if (intent === "light-impact") {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      return;
    }
    const feedback = {
      success: Haptics.NotificationFeedbackType.Success,
      warning: Haptics.NotificationFeedbackType.Warning,
      error: Haptics.NotificationFeedbackType.Error,
    }[intent];
    await Haptics.notificationAsync(feedback);
  },
};
