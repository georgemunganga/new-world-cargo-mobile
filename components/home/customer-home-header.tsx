import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

export function CustomerHomeHeader({ customerName, onNotifications, onAccount }: { customerName?: string; onNotifications: () => void; onAccount: () => void }) {
  const firstName = customerName?.trim().split(/\s+/)[0] || "there";
  return <View style={styles.header}><View style={styles.brand}><View style={styles.brandMark}><AppIcon name="arrow-top-right" size={19} color={nwcColors.primaryInk} /></View><Image accessibilityLabel="New WorldCargo" source={require("../../assets/images/new-world-cargo-wordmark.png")} resizeMode="contain" style={styles.wordmark} /></View><View style={styles.actions}><IconButton label="Open notifications" icon="bell-outline" badge onPress={onNotifications} /><TouchableOpacity accessibilityRole="button" accessibilityLabel="Open Account" accessibilityHint="Open your account and delivery preferences" onPress={onAccount} activeOpacity={0.74} style={styles.avatar}><Text style={styles.avatarText}>{firstName.slice(0, 1).toUpperCase()}</Text></TouchableOpacity></View></View>;
}

const styles = StyleSheet.create({
  header: { minHeight: 66, borderRadius: 24, paddingHorizontal: 12, backgroundColor: "#0B151C", flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 }, brand: { flex: 1, minWidth: 0, flexDirection: "row", alignItems: "center", gap: 9 }, brandMark: { height: 39, width: 39, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary }, wordmark: { width: 120, height: 38 }, actions: { flexDirection: "row", alignItems: "center", gap: 8 }, avatar: { width: 38, height: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "#D6E3E8", borderWidth: 2, borderColor: nwcColors.primary }, avatarText: { color: nwcColors.brandNavy, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
});
