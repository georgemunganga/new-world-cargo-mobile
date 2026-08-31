import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";

export function HomeServiceTile({ label, icon, accent = false, onPress }: { label: string; icon: AppIconName; accent?: boolean; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Choose ${label}`} onPress={onPress} activeOpacity={0.76} style={[styles.tile, accent && styles.tileAccent]}><View style={[styles.iconWrap, accent && styles.iconWrapAccent]}><AppIcon name={icon} size={23} color={accent ? nwcColors.primaryInk : nwcColors.brandNavy} /></View><Text numberOfLines={2} style={styles.label}>{label}</Text></TouchableOpacity>;
}

const styles = StyleSheet.create({
  tile: { flex: 1, minHeight: 112, borderRadius: 22, padding: 12, justifyContent: "space-between", backgroundColor: "#F5F8F9", borderWidth: 1, borderColor: "#E4EAED" },
  tileAccent: { backgroundColor: nwcColors.brandNavy, borderColor: nwcColors.brandNavy },
  iconWrap: { height: 42, width: 42, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.white },
  iconWrapAccent: { backgroundColor: nwcColors.primary },
  label: { color: nwcColors.foreground, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold", marginTop: 8 },
});
