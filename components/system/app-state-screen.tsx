import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { PrimaryButton, SecondaryButton, Screen } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

type AppStateScreenProps = {
  eyebrow: string;
  title: string;
  detail: string;
  icon: AppIconName;
  tone: "primary" | "info" | "warning" | "error";
  loading?: boolean;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
};

export function AppStateScreen({ eyebrow, title, detail, icon, tone, loading, primaryLabel, onPrimary, secondaryLabel, onSecondary }: AppStateScreenProps) {
  const color = { primary: nwcColors.primary, info: nwcColors.info, warning: nwcColors.warning, error: nwcColors.error }[tone];
  return <Screen><View style={styles.page}><View style={[styles.iconWrap, { backgroundColor: color }]}>{loading ? <ActivityIndicator color={nwcColors.primaryInk} /> : <AppIcon name={icon} size={34} color={tone === "primary" || tone === "warning" ? nwcColors.primaryInk : nwcColors.white} />}</View><View style={styles.copy}><Text style={[styles.eyebrow, { color }]}>{eyebrow}</Text><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View><View style={styles.actions}><PrimaryButton label={primaryLabel} onPress={onPrimary} />{secondaryLabel && onSecondary ? <SecondaryButton label={secondaryLabel} onPress={onSecondary} /> : null}</View></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, justifyContent: "center", paddingHorizontal: 28, gap: 24 },
  iconWrap: { width: 80, height: 80, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  copy: { gap: 8 },
  eyebrow: { fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.6, textTransform: "uppercase" },
  title: { color: nwcColors.foreground, fontSize: 30, lineHeight: 38, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.5 },
  detail: { color: nwcColors.muted, fontSize: 15, lineHeight: 23, fontFamily: "Poppins_500Medium" },
  actions: { gap: 10, marginTop: 12 },
});
