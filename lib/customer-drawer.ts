export type CustomerDrawerSnap = "half" | "expanded" | "dismissed";

export function nextCustomerDrawerSnap(current: Exclude<CustomerDrawerSnap, "dismissed">, verticalDrag: number): CustomerDrawerSnap {
  if (verticalDrag > 118) return "dismissed";
  if (verticalDrag < -72) return "expanded";
  if (verticalDrag > 48 && current === "expanded") return "half";
  return current;
}

export function drawerHeightForSnap(viewportHeight: number, topInset: number, snap: Exclude<CustomerDrawerSnap, "dismissed">): number {
  const halfHeight = Math.round(viewportHeight * 0.56);
  const expandedHeight = Math.max(halfHeight, viewportHeight - topInset - 12);
  return snap === "expanded" ? expandedHeight : halfHeight;
}
