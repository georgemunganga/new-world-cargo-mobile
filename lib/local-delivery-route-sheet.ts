export type LocalDeliveryRouteTarget = "from" | "to";
export type LocalDeliverySheetMode = "compact" | "editing" | "adjusting-pin";

export const localDeliveryCompactSheetHeight = 414;
export const localDeliveryPinAdjustmentSheetHeight = 458;

export function getLocalDeliveryRouteSheetState(activeTarget: LocalDeliveryRouteTarget | null, viewportHeight: number, isAdjustingPin = false) {
  const expandedHeight = Math.min(Math.max(viewportHeight * 0.72, 440), 600);
  const mode: LocalDeliverySheetMode = activeTarget ? "editing" : isAdjustingPin ? "adjusting-pin" : "compact";
  return {
    mode,
    target: activeTarget,
    height: mode === "editing" ? expandedHeight : mode === "adjusting-pin" ? localDeliveryPinAdjustmentSheetHeight : localDeliveryCompactSheetHeight,
  };
}
