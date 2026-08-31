import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton, Screen } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

const notifications = [
  { id: "payment", title: "Final price is ready", detail: "Review the bill for your import cargo before it moves.", tone: "warning" as const, icon: "alert-circle-outline" as const, route: "/bills" },
  { id: "delivery", title: "Your shipment is out for delivery", detail: "NWC-24518 is expected today between 15:30 and 16:15.", tone: "info" as const, icon: "truck-fast-outline" as const, route: "/shipments/nwc-24518" },
  { id: "receipt", title: "Shipment delivered", detail: "NWC-23411 has been delivered. Proof of delivery is available.", tone: "success" as const, icon: "check-circle-outline" as const, route: "/shipments/nwc-23411" },
];

export default function NotificationsScreen() {
  return <Screen><View style={styles.page}><View style={styles.header}><View><Text style={styles.title}>Notifications</Text><Text style={styles.summary}>Your latest delivery and payment updates.</Text></View><View style={styles.headerActions}><TouchableOpacity accessibilityRole="button" accessibilityLabel="Notification preferences" onPress={() => router.push("/notifications/preferences" as Href)} style={styles.settingsButton}><AppIcon name="tune-variant" size={20} color={nwcColors.brandNavy} /></TouchableOpacity><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /></View></View><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>{notifications.map((notice) => <TouchableOpacity key={notice.id} accessibilityRole="button" accessibilityLabel={notice.title} accessibilityHint={notice.detail} onPress={() => router.push(notice.route as never)} activeOpacity={0.74} style={styles.noticeRow}><View style={[styles.noticeIcon, notice.tone === "warning" && styles.noticeIconWarning, notice.tone === "success" && styles.noticeIconSuccess]}><AppIcon name={notice.icon} size={20} color={notice.tone === "warning" ? nwcColors.warning : notice.tone === "success" ? nwcColors.success : nwcColors.info} /></View><View style={styles.noticeCopy}><Text numberOfLines={1} style={styles.noticeTitle}>{notice.title}</Text><Text numberOfLines={1} style={styles.noticeDetail}>{notice.detail}</Text></View><AppIcon name="chevron-right" size={20} color={nwcColors.muted} /></TouchableOpacity>)}</ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", gap: 12 },
  headerActions: { flexDirection: "row", gap: 8 },
  settingsButton: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: nwcColors.border, backgroundColor: nwcColors.surface },
  title: { color: nwcColors.foreground, fontSize: 29, lineHeight: 37, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.5 },
  summary: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_500Medium", marginTop: 2 },
  content: { gap: 8, paddingTop: 22, paddingBottom: 30 },
  noticeRow: { minHeight: 76, borderRadius: 21, backgroundColor: nwcColors.surface, borderWidth: 1, borderColor: "#E5ECEE", paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 11 },
  noticeIcon: { height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#EAF4F8" },
  noticeIconWarning: { backgroundColor: "#FBF0D8" },
  noticeIconSuccess: { backgroundColor: "#E5F4EE" },
  noticeCopy: { flex: 1, gap: 2 },
  noticeTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  noticeDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" },
});
