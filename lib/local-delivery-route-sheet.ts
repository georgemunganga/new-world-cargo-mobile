export type LocalDeliveryRouteTarget = "from" | "to";

export const localDeliveryCompactSheetHeight = 314;

export function getLocalDeliveryRouteSheetState(activeTarget: LocalDeliveryRouteTarget | null, viewportHeight: number) {
  const expandedHeight = Math.min(Math.max(viewportHeight * 0.72, 440), 600);
  return {
    mode: activeTarget ? "editing" as const : "compact" as const,
    target: activeTarget,
    height: activeTarget ? expandedHeight : localDeliveryCompactSheetHeight,
  };
}
