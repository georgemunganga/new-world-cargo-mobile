import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppIcon } from "@/components/ui/app-icon";
import { nwcColors } from "@/lib/nwc-theme";

type RoutePoint = { value: string; detail: string };

export function RouteEntryCard({ from, to, onFromPress, onToPress, accessibilityHint }: { from: RoutePoint; to: RoutePoint; onFromPress: () => void; onToPress: () => void; accessibilityHint?: string }) {
  return <View accessibilityLabel={accessibilityHint} style={styles.card}><TouchableOpacity accessibilityRole="button" accessibilityLabel="Choose pickup location" accessibilityHint={from.value} onPress={onFromPress} activeOpacity={0.74} style={styles.row}><View style={styles.routeIconFrom}><AppIcon name="circle-outline" size={20} color={nwcColors.brandNavy} /></View><View style={styles.copy}><Text style={styles.label}>From where?</Text><Text numberOfLines={1} style={styles.value}>{from.value}</Text>{from.detail ? <Text numberOfLines={1} style={styles.detail}>{from.detail}</Text> : null}</View><AppIcon name="chevron-right" size={21} color={nwcColors.muted} /></TouchableOpacity><View style={styles.divider} /><TouchableOpacity accessibilityRole="button" accessibilityLabel="Choose delivery location" accessibilityHint={to.value} onPress={onToPress} activeOpacity={0.74} style={styles.row}><View style={styles.routeIconTo}><AppIcon name="map-marker" size={20} color={nwcColors.primaryInk} /></View><View style={styles.copy}><Text style={styles.label}>To where?</Text><Text numberOfLines={1} style={styles.value}>{to.value}</Text>{to.detail ? <Text numberOfLines={1} style={styles.detail}>{to.detail}</Text> : null}</View><AppIcon name="chevron-right" size={21} color={nwcColors.muted} /></TouchableOpacity></View>;
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, overflow: "hidden", backgroundColor: nwcColors.white, borderWidth: 1, borderColor: "#E4EAED" },
  row: { minHeight: 75, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, gap: 12 },
  routeIconFrom: { width: 43, height: 43, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#EDF3F5" },
  routeIconTo: { width: 43, height: 43, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  copy: { flex: 1, gap: 1 },
  label: { color: nwcColors.muted, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_700Bold" },
  value: { color: nwcColors.foreground, fontSize: 16, lineHeight: 22, fontFamily: "Poppins_800ExtraBold" },
  detail: { color: nwcColors.info, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_600SemiBold" },
  divider: { height: 1, backgroundColor: "#E7ECEE", marginLeft: 70 },
});
