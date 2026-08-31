import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, Screen, SectionHeader, StatusBadge } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

const notifications = [
  { id: "payment", title: "Final price is ready", detail: "Review the bill for your import cargo before it moves.", tone: "warning" as const, icon: "alert-circle-outline" as const, route: "/bills" },
  { id: "delivery", title: "Your shipment is out for delivery", detail: "NWC-24518 is expected today between 15:30 and 16:15.", tone: "info" as const, icon: "truck-fast-outline" as const, route: "/shipments/nwc-24518" },
  { id: "receipt", title: "Shipment delivered", detail: "NWC-23411 has been delivered. Proof of delivery is available.", tone: "success" as const, icon: "check-circle-outline" as const, route: "/shipments/nwc-23411" },
];

export default function NotificationsScreen() {
  return <Screen><View style={styles.page}><View style={styles.header}><View><Text style={styles.eyebrow}>Customer updates</Text><SectionHeader title="Notifications" /></View><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /></View><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>{notifications.map((notice) => <TouchableOpacity key={notice.id} accessibilityRole="button" accessibilityLabel={notice.title} accessibilityHint={notice.detail} onPress={() => router.push(notice.route as never)} activeOpacity={0.78}><Card style={styles.card}><View style={styles.cardTop}><View style={styles.noticeIcon}><AppIcon name={notice.icon} size={22} color={nwcColors.brandNavy} /></View><StatusBadge label={notice.tone === "warning" ? "Action needed" : notice.tone === "success" ? "Completed" : "Shipment update"} tone={notice.tone} /></View><Text style={styles.title}>{notice.title}</Text><Text style={styles.detail}>{notice.detail}</Text><View style={styles.readMore}><Text style={styles.readMoreText}>Open update</Text><AppIcon name="arrow-right" size={17} color={nwcColors.info} /></View></Card></TouchableOpacity>)}</ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 16 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 2 },
  content: { gap: 12, paddingTop: 12, paddingBottom: 30 },
  card: { gap: 10 },
  cardTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  noticeIcon: { height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#EAF1F4" },
  title: { color: nwcColors.foreground, fontSize: 16, lineHeight: 21, fontWeight: "800" },
  detail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontWeight: "500" },
  readMore: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 4 },
  readMoreText: { color: nwcColors.info, fontSize: 13, lineHeight: 18, fontWeight: "800" },
});
