import { useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * Vertical space reserved for the customer floating dock plus its safe-area gap.
 * Apply this to scrollable tab content so the final action or row never hides behind navigation.
 */
export function useFloatingNavigationClearance() {
  const insets = useSafeAreaInsets();
  const dockHeight = 74;
  const dockOffset = Math.max(insets.bottom + 14, 30);
  return dockHeight + dockOffset + 18;
}
