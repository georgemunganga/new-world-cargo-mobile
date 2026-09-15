import { useEffect, useRef } from "react";
import {
  AccessibilityInfo,
  Animated,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";

export function Skeleton({ style }: { style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.bone, style]} />;
}
export function SkeletonGroup({
  children,
  style,
  label = "Loading content",
}: React.PropsWithChildren<{ style?: StyleProp<ViewStyle>; label?: string }>) {
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    let active = true;
    let animation: Animated.CompositeAnimation | undefined;
    const update = (reduce: boolean) => {
      animation?.stop();
      opacity.setValue(1);
      if (!reduce && active) {
        animation = Animated.loop(
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 0.48,
              duration: 800,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 1,
              duration: 800,
              useNativeDriver: true,
            }),
          ]),
        );
        animation.start();
      }
    };
    void AccessibilityInfo.isReduceMotionEnabled().then(update);
    const listener = AccessibilityInfo.addEventListener(
      "reduceMotionChanged",
      update,
    );
    return () => {
      active = false;
      animation?.stop();
      listener.remove();
    };
  }, [opacity]);
  return (
    <Animated.View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityState={{ busy: true }}
      style={[{ opacity, gap: 12 }, style]}
    >
      {children}
    </Animated.View>
  );
}
export function ListSkeleton({
  kind = "row",
  count = 3,
}: {
  kind?: "row" | "shipment" | "invoice";
  count?: number;
}) {
  return (
    <SkeletonGroup label={`Loading ${kind === "row" ? "items" : `${kind}s`}`}>
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.row}>
            <Skeleton style={{ width: 44, height: 44, borderRadius: 14 }} />
            <View style={{ flex: 1, gap: 10 }}>
              <Skeleton style={{ width: "70%", height: 17 }} />
              <Skeleton style={{ width: "45%", height: 12 }} />
            </View>
            {kind === "invoice" ? (
              <Skeleton style={{ width: 62, height: 22 }} />
            ) : null}
          </View>
          {kind === "shipment" ? (
            <>
              <Skeleton style={{ height: 12, width: "90%" }} />
              <Skeleton style={{ height: 12, width: "65%" }} />
              <Skeleton style={{ height: 30, width: "100%" }} />
            </>
          ) : null}
        </View>
      ))}
    </SkeletonGroup>
  );
}
export function MapSkeleton({
  height = 176,
  fill = false,
}: {
  height?: number;
  fill?: boolean;
}) {
  return (
    <View
      pointerEvents="none"
      style={[
        {
          height: fill ? undefined : height,
          overflow: "hidden",
          borderRadius: 24,
          backgroundColor: "#EEF2F2",
        },
        fill && StyleSheet.absoluteFillObject,
      ]}
    >
      <SkeletonGroup label="Loading map" style={{ flex: 1, padding: 18 }}>
        <View style={{ flex: 1, flexDirection: "row", gap: 18 }}>
          <Skeleton style={{ flex: 1 }} />
          <Skeleton style={{ flex: 2 }} />
        </View>
        <Skeleton style={{ height: 14 }} />
        <View style={{ flex: 1, flexDirection: "row", gap: 20 }}>
          <Skeleton style={{ flex: 2 }} />
          <Skeleton style={{ flex: 1 }} />
        </View>
      </SkeletonGroup>
    </View>
  );
}
export function ProfileSkeleton() {
  return (
    <SkeletonGroup label="Loading profile">
      <View style={styles.row}>
        <Skeleton style={{ width: 72, height: 72, borderRadius: 36 }} />
        <View style={{ flex: 1, gap: 12 }}>
          <Skeleton style={{ height: 22, width: "70%" }} />
          <Skeleton style={{ height: 14, width: "50%" }} />
        </View>
      </View>
      <Skeleton style={{ height: 56 }} />
      <Skeleton style={{ height: 56 }} />
      <Skeleton style={{ height: 56 }} />
    </SkeletonGroup>
  );
}
export function TrackingSkeleton() {
  return (
    <View style={{ gap: 20 }}>
      <MapSkeleton height={328} />
      <View style={{ paddingHorizontal: 20, gap: 16 }}>
        <ListSkeleton kind="shipment" count={1} />
        <ListSkeleton count={2} />
      </View>
    </View>
  );
}
export function InvoiceSkeleton() {
  return (
    <View style={{ gap: 18 }}>
      <SkeletonGroup label="Loading balance">
        <Skeleton style={{ height: 150, borderRadius: 24 }} />
        <Skeleton style={{ height: 74, borderRadius: 18 }} />
      </SkeletonGroup>
      <ListSkeleton kind="invoice" />
    </View>
  );
}
const styles = StyleSheet.create({
  bone: { backgroundColor: "#DCE5E8", borderRadius: 8 },
  card: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E5ECEF",
    padding: 16,
    gap: 16,
    backgroundColor: "#FAFCFC",
  },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
});
