import { customerScreenGutter, customerScreenTopInset, getCustomerContentBottomInset } from "@/lib/customer-screen-layout";
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** Shared content insets for standard customer screens. Screen/ScreenContainer owns the top safe area. */
export function useCustomerContentInsets({ hasFloatingNavigation = false }: { hasFloatingNavigation?: boolean } = {}) {
  const insets = useSafeAreaInsets();
  return {
    paddingHorizontal: customerScreenGutter,
    paddingTop: customerScreenTopInset,
    paddingBottom: getCustomerContentBottomInset(insets.bottom, hasFloatingNavigation),
  };
}
