import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { IconButton } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

export function CustomerHomeHeader({ customerName, onNotifications, onAccount }: { customerName?: string; onNotifications: () => void; onAccount: () => void }) {
  const firstName = customerName?.trim().split(/\s+/)[0] || "there";
  return <View style={styles.header}><View style={styles.greeting}><Text style={styles.eyebrow}>New WorldCargo</Text><Text style={styles.title}>Good day, {firstName}</Text></View><View style={styles.actions}><IconButton label="Open notifications" icon="bell-outline" badge onPress={onNotifications} /><TouchableOpacity accessibilityRole="button" accessibilityLabel="Open Account" accessibilityHint="Open your account and delivery preferences" onPress={onAccount} activeOpacity={0.74} style={styles.avatar}><Text style={styles.avatarText}>{firstName.slice(0, 1).toUpperCase()}</Text></TouchableOpacity></View></View>;
}

const styles = StyleSheet.create({
  header: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16 }, greeting: { flex: 1, gap: 2 }, eyebrow: { color: nwcColors.info, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.7, textTransform: "uppercase" }, title: { color: nwcColors.foreground, fontSize: 25, lineHeight: 31, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.45 }, actions: { flexDirection: "row", alignItems: "center", gap: 8 }, avatar: { width: 44, height: 44, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "#E4EDF0", borderWidth: 1, borderColor: "#D8E4E8" }, avatarText: { color: nwcColors.brandNavy, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
});
