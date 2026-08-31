import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { statusPresentation } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";
import type { Shipment } from "@/types/cargo";

export function MyOrderRow({ shipment, onPress }: { shipment: Shipment; onPress: () => void }) {
  const status = statusPresentation[shipment.status];
  const statusIcon: AppIconName = status.icon as AppIconName;
  const colors = status.tone === "success" ? { backgroundColor: "#E5F4EE", color: nwcColors.success } : status.tone === "warning" ? { backgroundColor: "#FBF0D8", color: nwcColors.warning } : { backgroundColor: "#EAF4F8", color: nwcColors.info };
  const originCode = shipment.pickup.city === "China" ? "CN" : shipment.pickup.city === "Dubai" ? "AE" : "ZM";
  const destinationCode = shipment.destination.city === "Zambia" || shipment.destination.city === "Lusaka" ? "ZM" : shipment.destination.city === "Johannesburg" ? "ZA" : "ZM";
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Open shipment ${shipment.reference}`} accessibilityHint={`${status.label}. ${shipment.pickup.city} to ${shipment.destination.city}`} onPress={onPress} activeOpacity={0.72} style={styles.row}><View style={styles.routeMarks}><View style={[styles.countryMark, originCode === "CN" && styles.china, originCode === "AE" && styles.uae]}><Text style={styles.countryCode}>{originCode}</Text></View><AppIcon name="arrow-right" size={15} color={nwcColors.muted} /><View style={[styles.countryMark, destinationCode === "ZM" ? styles.zambia : styles.southAfrica]}><Text style={styles.countryCode}>{destinationCode}</Text></View></View><View style={styles.copy}><Text numberOfLines={1} style={styles.route}>{`${shipment.pickup.city} → ${shipment.destination.city}`}</Text><Text numberOfLines={1} style={styles.reference}>{`Order ${shipment.reference.replace("NWC-", "NT-")}`}</Text></View><View style={[styles.status, { backgroundColor: colors.backgroundColor }]}><AppIcon name={statusIcon} size={12} color={colors.color} /><Text numberOfLines={1} style={[styles.statusText, { color: colors.color }]}>{status.label}</Text></View></TouchableOpacity>;
}

const styles = StyleSheet.create({
  row: { minHeight: 75, flexDirection: "row", alignItems: "center", gap: 10, borderBottomWidth: 1, borderBottomColor: "#E9EEF0", paddingVertical: 10 },
  routeMarks: { flexDirection: "row", alignItems: "center", gap: 4 },
  countryMark: { height: 28, minWidth: 28, paddingHorizontal: 4, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#D9E9B5" },
  china: { backgroundColor: "#E94A4A" },
  uae: { backgroundColor: "#2FA563" },
  zambia: { backgroundColor: "#5C9E4B" },
  southAfrica: { backgroundColor: "#2E8B72" },
  countryCode: { color: nwcColors.white, fontSize: 8, lineHeight: 11, fontFamily: "Poppins_800ExtraBold" },
  copy: { flex: 1, minWidth: 0, gap: 1 },
  route: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  reference: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_600SemiBold" },
  status: { minHeight: 27, maxWidth: 102, borderRadius: 10, paddingHorizontal: 7, flexDirection: "row", alignItems: "center", gap: 4 },
  statusText: { flexShrink: 1, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold" },
});
