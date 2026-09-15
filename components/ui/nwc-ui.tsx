import { useRef, useState, type PropsWithChildren, type ReactNode } from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View, type GestureResponderEvent, type StyleProp, type TextStyle, type ViewStyle } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { nwcColors, nwcRadii } from "@/lib/nwc-theme";

export type AppButtonProps = {
  label: string;
  onPress: (event: GestureResponderEvent) => void | Promise<unknown>;
  disabled?: boolean;
  loading?: boolean;
  icon?: AppIconName;
  style?: StyleProp<ViewStyle>;
  accessibilityHint?: string;
};

function useButtonAction(onPress: AppButtonProps["onPress"], loading = false) {
  const [awaiting, setAwaiting] = useState(false);
  const inFlight = useRef(false);
  const busy = loading || awaiting;
  const handlePress = (event: GestureResponderEvent) => {
    if (busy || inFlight.current) return;
    const result = onPress(event);
    if (!result || typeof result.then !== "function") return;
    inFlight.current = true;
    setAwaiting(true);
    void Promise.resolve(result).then(
      () => {
        inFlight.current = false;
        setAwaiting(false);
      },
      (error) => {
        inFlight.current = false;
        setAwaiting(false);
        if (__DEV__) console.error("[NWC UI] Button action failed", error);
      },
    );
  };
  return { busy, handlePress };
}

export function PrimaryButton({ label, onPress, disabled, loading, icon, style, accessibilityHint }: AppButtonProps) {
  const { busy, handlePress } = useButtonAction(onPress, loading);
  const unavailable = disabled || busy;
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} accessibilityHint={accessibilityHint} accessibilityState={{ disabled: unavailable, busy }} disabled={unavailable} activeOpacity={0.84} onPress={handlePress} style={[styles.primaryButton, unavailable && styles.disabledButton, style]}>{busy ? <ActivityIndicator size="small" color={nwcColors.primaryInk} /> : null}<Text style={styles.primaryButtonText}>{label}</Text>{icon && !busy ? <AppIcon name={icon} size={19} color={nwcColors.primaryInk} /> : null}</TouchableOpacity>;
}

export function SecondaryButton({ label, onPress, disabled, loading, icon, style, accessibilityHint }: AppButtonProps) {
  const { busy, handlePress } = useButtonAction(onPress, loading);
  const unavailable = disabled || busy;
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} accessibilityHint={accessibilityHint} accessibilityState={{ disabled: unavailable, busy }} disabled={unavailable} activeOpacity={0.76} onPress={handlePress} style={[styles.secondaryButton, unavailable && styles.disabledButton, style]}>{busy ? <ActivityIndicator size="small" color={nwcColors.brandNavy} /> : null}<Text style={styles.secondaryButtonText}>{label}</Text>{icon && !busy ? <AppIcon name={icon} size={19} color={nwcColors.brandNavy} /> : null}</TouchableOpacity>;
}

export function IconButton({ label, icon, onPress, badge }: { label: string; icon: AppIconName; onPress: () => void; badge?: boolean }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={label} activeOpacity={0.7} onPress={onPress} style={styles.iconButton}><AppIcon name={icon} size={22} color={nwcColors.brandNavy} />{badge ? <View style={styles.notificationDot} /> : null}</TouchableOpacity>;
}

export function Screen({ children, scroll = false }: PropsWithChildren<{ scroll?: boolean }>) {
  return <ScreenContainer className="flex-1" containerClassName="bg-background">{children}</ScreenContainer>;
}

export function Card({ children, style }: PropsWithChildren<{ style?: StyleProp<ViewStyle> }>) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function SectionHeader({ title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return <View style={styles.sectionHeader}><View style={styles.sectionTitleWrap}><Text style={styles.sectionTitle}>{title}</Text></View>{action}</View>;
}

export function StatusBadge({ label, tone = "neutral", icon }: { label: string; tone?: "neutral" | "info" | "success" | "warning"; icon?: AppIconName }) {
  const palette = {
    neutral: { backgroundColor: nwcColors.surfaceRaised, color: nwcColors.muted },
    info: { backgroundColor: "#E6F3F8", color: nwcColors.info },
    success: { backgroundColor: "#E5F4EE", color: nwcColors.success },
    warning: { backgroundColor: "#FBF0D8", color: nwcColors.warning },
  }[tone];
  return <View accessibilityRole="text" style={[styles.statusBadge, { backgroundColor: palette.backgroundColor }]}>{icon ? <AppIcon name={icon} size={14} color={palette.color} /> : null}<Text style={[styles.statusBadgeText, { color: palette.color }]}>{label}</Text></View>;
}

export type AppNoticeTone = "info" | "success" | "warning" | "error";

export function AppNotice({ message, tone = "info", style, textStyle }: { message: string; tone?: AppNoticeTone; style?: StyleProp<ViewStyle>; textStyle?: StyleProp<TextStyle> }) {
  const palette = {
    info: { backgroundColor: "#E6F3F8", color: nwcColors.info, icon: "information-outline" as const },
    success: { backgroundColor: "#E5F4EE", color: nwcColors.success, icon: "check-circle-outline" as const },
    warning: { backgroundColor: "#FBF0D8", color: nwcColors.warning, icon: "alert-outline" as const },
    error: { backgroundColor: "#FFF0EF", color: nwcColors.error, icon: "alert-circle-outline" as const },
  }[tone];
  return <View accessibilityRole={tone === "error" ? "alert" : "text"} style={[styles.notice, { backgroundColor: palette.backgroundColor }, style]}><AppIcon name={palette.icon} size={18} color={palette.color} /><Text style={[styles.noticeText, { color: palette.color }, textStyle]}>{message}</Text></View>;
}

export function Heading({ children, style }: PropsWithChildren<{ style?: StyleProp<TextStyle> }>) { return <Text style={[styles.heading, style]}>{children}</Text>; }
export function Body({ children, style }: PropsWithChildren<{ style?: StyleProp<TextStyle> }>) { return <Text style={[styles.body, style]}>{children}</Text>; }

export function RouteLine({ from, to }: { from: string; to: string }) {
  return <View style={styles.routeLine}><View style={styles.routeMarkers}><View style={styles.originDot} /><View style={styles.routeStem} /><View style={styles.destinationDot} /></View><View style={styles.routeLabels}><Text numberOfLines={1} style={styles.routeText}>{from}</Text><Text numberOfLines={1} style={styles.routeText}>{to}</Text></View></View>;
}

const styles = StyleSheet.create({
  primaryButton: { minHeight: 52, borderRadius: 22, backgroundColor: nwcColors.primary, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, paddingHorizontal: 18 },
  primaryButtonText: { color: nwcColors.primaryInk, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
  secondaryButton: { minHeight: 50, borderRadius: 20, borderWidth: 1, borderColor: "#E1E8EA", backgroundColor: nwcColors.surfaceElevated, alignItems: "center", justifyContent: "center", flexDirection: "row", gap: 8, paddingHorizontal: 18 },
  secondaryButtonText: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_700Bold" },
  disabledButton: { opacity: 0.48 },
  iconButton: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: "#E1E8EA", backgroundColor: nwcColors.surfaceElevated, alignItems: "center", justifyContent: "center" },
  notificationDot: { position: "absolute", top: 9, right: 9, width: 8, height: 8, borderRadius: 4, backgroundColor: nwcColors.primary, borderWidth: 1.5, borderColor: nwcColors.surface },
  card: { backgroundColor: nwcColors.surface, borderWidth: 1, borderColor: "#E3E9EB", borderRadius: 24, padding: 17 },
  sectionHeader: { alignItems: "center", flexDirection: "row", justifyContent: "space-between", gap: 16, marginBottom: 10 },
  sectionTitleWrap: { flexShrink: 1 },
  eyebrow: { color: nwcColors.warning, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.9, textTransform: "uppercase", marginBottom: 3 },
  sectionTitle: { color: nwcColors.foreground, fontSize: 19, lineHeight: 25, fontFamily: "Poppins_800ExtraBold" },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 5, borderRadius: nwcRadii.pill, alignSelf: "flex-start", paddingVertical: 5, paddingHorizontal: 9 },
  statusBadgeText: { fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold" },
  notice: { minHeight: 48, borderRadius: 16, paddingHorizontal: 13, paddingVertical: 11, flexDirection: "row", alignItems: "center", gap: 9 },
  noticeText: { flex: 1, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_700Bold" },
  heading: { color: nwcColors.foreground, fontSize: 29, lineHeight: 36, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.6 },
  body: { color: nwcColors.muted, fontSize: 14, lineHeight: 21, fontFamily: "Poppins_500Medium" },
  routeLine: { flexDirection: "row", gap: 10, alignItems: "stretch" },
  routeMarkers: { width: 12, alignItems: "center", paddingVertical: 5 },
  originDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: nwcColors.brandNavy },
  routeStem: { width: 1.5, flex: 1, backgroundColor: nwcColors.border, marginVertical: 4 },
  destinationDot: { width: 10, height: 10, borderRadius: 2, backgroundColor: nwcColors.primary },
  routeLabels: { flex: 1, justifyContent: "space-between", gap: 14 },
  routeText: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_700Bold" },
});
