import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { statusPresentation } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";
import type { Shipment } from "@/types/cargo";

export function MyOrderRow({ shipment, onPress }: { shipment: Shipment; onPress: () => void }) {
  const status = statusPresentation[shipment.status];
  const statusIcon: AppIconName = status.icon as AppIconName;
  const colors = status.tone === "success" ? { backgroundColor: "#E5F4EE", color: nwcColors.success } : status.tone === "warning" ? { backgroundColor: "#FBF0D8", color: nwcColors.warning } : { backgroundColor: "#EAF4F8", color: nwcColors.info };
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Open shipment ${shipment.reference}`} accessibilityHint={`${status.label}. ${shipment.pickup.city} to ${shipment.destination.city}`} onPress={onPress} activeOpacity={0.72} style={styles.row}><View style={styles.flag}><AppIcon name={shipment.service === "import" ? "airplane" : shipment.service === "intercity" ? "truck-fast-outline" : "map-marker-path"} size={17} color={nwcColors.brandNavy} /></View><View style={styles.copy}><Text numberOfLines={1} style={styles.route}>{`${shipment.pickup.city} → ${shipment.destination.city}`}</Text><Text numberOfLines={1} style={styles.reference}>{shipment.reference}</Text></View><View style={[styles.status, { backgroundColor: colors.backgroundColor }]}><AppIcon name={statusIcon} size={12} color={colors.color} /><Text numberOfLines={1} style={[styles.statusText, { color: colors.color }]}>{status.label}</Text></View></TouchableOpacity>;
}

const styles = StyleSheet.create({
  row: { minHeight: 64, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: "#E9EEF0", paddingVertical: 9 },
  flag: { height: 34, width: 34, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#EDF3F5" },
  copy: { flex: 1, minWidth: 0, gap: 1 },
  route: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  reference: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_600SemiBold" },
  status: { minHeight: 27, maxWidth: 102, borderRadius: 10, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", gap: 4 },
  statusText: { flexShrink: 1, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold" },
});
