import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";

export function AccountRow({ icon, title, detail, onPress }: { icon: AppIconName; title: string; detail: string; onPress?: () => void }) {
  const content = <><View style={styles.iconWrap}><AppIcon name={icon} size={21} color={nwcColors.brandNavy} /></View><View style={styles.copy}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View><AppIcon name="chevron-right" size={21} color={nwcColors.muted} /></>;
  if (onPress) return <TouchableOpacity accessibilityRole="button" accessibilityLabel={title} accessibilityHint={detail} activeOpacity={0.75} onPress={onPress} style={styles.row}>{content}</TouchableOpacity>;
  return <View style={styles.row}>{content}</View>;
}

const styles = StyleSheet.create({
  row: { minHeight: 70, flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 10 },
  iconWrap: { height: 42, width: 42, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#EAF1F4" },
  copy: { flex: 1, gap: 2 },
  title: { color: nwcColors.foreground, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
  detail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_500Medium" },
});
