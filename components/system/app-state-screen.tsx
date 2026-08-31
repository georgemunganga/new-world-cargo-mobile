import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { PrimaryButton, Screen, SecondaryButton } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

export type AppStateScreenProps = {
  eyebrow: string;
  title: string;
  detail: string;
  icon: AppIconName;
  tone?: "primary" | "info" | "warning" | "error";
  loading?: boolean;
  primaryLabel?: string;
  onPrimary?: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export function AppStateScreen({ eyebrow, title, detail, icon, tone = "info", loading, primaryLabel, onPrimary, secondaryLabel, onSecondary }: AppStateScreenProps) {
  const colors = { primary: nwcColors.primary, info: "#DDEFF7", warning: "#FBF0D8", error: "#FBE5E5" }[tone];
  const iconColor = tone === "primary" ? nwcColors.primaryInk : tone === "error" ? nwcColors.error : tone === "warning" ? nwcColors.warning : nwcColors.info;
  return <Screen><View style={styles.screen}><View style={styles.top}><Image source={require("../../assets/images/new-world-cargo-logo.png")} contentFit="contain" accessibilityLabel="New WorldCargo" style={styles.logo} /></View><View style={styles.center}><View style={[styles.illustration, { backgroundColor: colors }]}>{loading ? <ActivityIndicator color={nwcColors.brandNavy} size="large" /> : <AppIcon name={icon} size={43} color={iconColor} />}</View><Text style={styles.eyebrow}>{eyebrow}</Text><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View><View style={styles.actions}>{primaryLabel && onPrimary ? <PrimaryButton label={primaryLabel} onPress={onPrimary} icon={loading ? undefined : "arrow-right"} /> : null}{secondaryLabel && onSecondary ? <SecondaryButton label={secondaryLabel} onPress={onSecondary} /> : null}</View></View></Screen>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 24, paddingBottom: 26 },
  top: { minHeight: 72, alignItems: "flex-start", justifyContent: "center" },
  logo: { width: 148, height: 58, marginLeft: -5 },
  center: { flex: 1, alignItems: "center", justifyContent: "center", paddingBottom: 26 },
  illustration: { width: 94, height: 94, borderRadius: 32, alignItems: "center", justifyContent: "center", marginBottom: 22 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.8, textTransform: "uppercase", textAlign: "center" },
  title: { maxWidth: 350, color: nwcColors.foreground, fontSize: 29, lineHeight: 37, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.4, textAlign: "center", marginTop: 7 },
  detail: { maxWidth: 350, color: nwcColors.muted, fontSize: 15, lineHeight: 22, fontFamily: "Poppins_500Medium", textAlign: "center", marginTop: 9 },
  actions: { gap: 10 },
});
