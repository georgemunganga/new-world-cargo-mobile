import { useMemo, useState } from "react";
import { PanResponder } from "react-native";

import { drawerHeightForSnap } from "@/lib/customer-drawer";

export function useBookingDrawerSnap(
  viewportHeight: number,
  topInset: number,
  collapsedHeight?: number,
) {
  const [expanded, setExpanded] = useState(false);
  const [dragY, setDragY] = useState(0);
  const halfHeight = drawerHeightForSnap(viewportHeight, topInset, "half");
  const sheetHeight = expanded
    ? drawerHeightForSnap(viewportHeight, topInset, "expanded")
    : Math.max(collapsedHeight ?? 0, halfHeight);
  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gesture) =>
          Math.abs(gesture.dy) > 5 &&
          Math.abs(gesture.dy) > Math.abs(gesture.dx),
        onPanResponderMove: (_, gesture) =>
          setDragY(Math.max(-110, Math.min(gesture.dy, 150))),
        onPanResponderRelease: (_, gesture) => {
          if (gesture.dy < -54) setExpanded(true);
          if (gesture.dy > 54) setExpanded(false);
          setDragY(0);
        },
        onPanResponderTerminate: () => setDragY(0),
      }),
    [],
  );

  return {
    expanded,
    setExpanded,
    sheetHeight,
    drawerTransform: {
      transform: [{ translateY: expanded ? Math.max(0, dragY) : dragY }],
    },
    panHandlers: panResponder.panHandlers,
    toggleExpanded: () => setExpanded((value) => !value),
  };
}
