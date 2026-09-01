export const customerScreenGutter = 20;
export const customerScreenTopInset = 20;
export const customerNoNavigationBottomInset = 20;
export const floatingNavigationDockHeight = 74;
export const floatingNavigationMinimumOffset = 30;
export const floatingNavigationSafeGap = 14;
export const floatingNavigationContentGap = 18;

export function getCustomerContentBottomInset(safeAreaBottom: number, hasFloatingNavigation: boolean) {
  if (!hasFloatingNavigation) return Math.max(safeAreaBottom, customerNoNavigationBottomInset);
  const dockOffset = Math.max(safeAreaBottom + floatingNavigationSafeGap, floatingNavigationMinimumOffset);
  return floatingNavigationDockHeight + dockOffset + floatingNavigationContentGap;
}
