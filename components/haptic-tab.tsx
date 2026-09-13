import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { PlatformPressable } from "@react-navigation/elements";
import { hapticService } from "@/lib/services/device/haptic-service";

export function HapticTab(props: BottomTabBarButtonProps) {
  return (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === "ios") {
          void hapticService.notify("light-impact");
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
