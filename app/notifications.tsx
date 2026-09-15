import { ListSkeleton } from "@/components/ui/skeleton";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton, Screen } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerNotifications } from "@/lib/use-cases/use-customer-notifications";

export default function NotificationsScreen() {
  const customerNotifications = useCustomerNotifications();
  const notifications = customerNotifications.notifications;
  const openNotice = (notice: (typeof notifications)[number]) => {
    customerNotifications.markRead(notice.id);
    if (notice.route) router.push(notice.route as Href);
  };

  return <Screen><View style={styles.page}><View style={styles.header}><View><Text style={styles.title}>Notifications</Text><Text style={styles.summary}>Your latest delivery and payment updates.</Text></View><View style={styles.headerActions}>{notifications.some((notice) => notice.unread) ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Mark all notifications as read" onPress={customerNotifications.markAllRead} style={styles.settingsButton}><AppIcon name="check-all" size={20} color={nwcColors.brandNavy} /></TouchableOpacity> : null}<TouchableOpacity accessibilityRole="button" accessibilityLabel="Notification preferences" onPress={() => router.push("/notifications/preferences" as Href)} style={styles.settingsButton}><AppIcon name="tune-variant" size={20} color={nwcColors.brandNavy} /></TouchableOpacity><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /></View></View><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>{customerNotifications.status === "loading" ? <ListSkeleton count={5} /> : null}{customerNotifications.status === "error" ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Retry loading notifications" onPress={customerNotifications.refresh} style={styles.emptyState}><Text style={styles.emptyTitle}>Could not load notifications</Text><Text style={styles.emptyDetail}>{customerNotifications.message}</Text></TouchableOpacity> : null}{customerNotifications.status === "empty" ? <View style={styles.emptyState}><View style={styles.emptyIcon}><AppIcon name="bell-sleep-outline" size={24} color={nwcColors.info} /></View><Text style={styles.emptyTitle}>No notifications yet</Text><Text style={styles.emptyDetail}>Shipment, payment, and delivery updates will appear here.</Text></View> : null}{notifications.map((notice) => <TouchableOpacity key={notice.id} accessibilityRole="button" accessibilityLabel={notice.title} accessibilityHint={notice.detail} onPress={() => openNotice(notice)} activeOpacity={0.74} style={[styles.noticeRow, notice.unread && styles.noticeRowUnread]}><View style={[styles.noticeIcon, notice.tone === "warning" && styles.noticeIconWarning, notice.tone === "success" && styles.noticeIconSuccess, notice.tone === "error" && styles.noticeIconError]}><AppIcon name={notice.icon as never} size={20} color={notice.tone === "warning" ? nwcColors.warning : notice.tone === "success" ? nwcColors.success : notice.tone === "error" ? nwcColors.error : nwcColors.info} /></View><View style={styles.noticeCopy}><View style={styles.noticeTitleRow}><Text numberOfLines={1} style={styles.noticeTitle}>{notice.title}</Text>{notice.unread ? <View style={styles.unreadDot} /> : null}</View><Text numberOfLines={1} style={styles.noticeDetail}>{notice.detail}</Text>{notice.displayTime ? <Text style={styles.noticeTime}>{notice.displayTime}</Text> : null}</View><AppIcon name={notice.route ? "chevron-right" : "check"} size={20} color={nwcColors.muted} /></TouchableOpacity>)}</ScrollView></View></Screen>;
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
  noticeRowUnread: { borderColor: "#F2C84B", backgroundColor: "#FFFDF6" },
  noticeIcon: { height: 40, width: 40, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#EAF4F8" },
  noticeIconWarning: { backgroundColor: "#FBF0D8" },
  noticeIconSuccess: { backgroundColor: "#E5F4EE" },
  noticeIconError: { backgroundColor: "#FDEBEE" },
  noticeCopy: { flex: 1, gap: 2 },
  noticeTitleRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  noticeTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  noticeDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" },
  noticeTime: { color: nwcColors.muted, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_600SemiBold" },
  unreadDot: { height: 7, width: 7, borderRadius: 4, backgroundColor: nwcColors.primary },
  emptyState: { minHeight: 160, borderRadius: 24, borderWidth: 1, borderColor: nwcColors.border, backgroundColor: nwcColors.surface, alignItems: "center", justifyContent: "center", padding: 20, gap: 8 },
  emptyIcon: { height: 44, width: 44, borderRadius: 18, backgroundColor: "#EAF4F8", alignItems: "center", justifyContent: "center" },
  emptyTitle: { color: nwcColors.foreground, fontSize: 16, lineHeight: 22, fontFamily: "Poppins_800ExtraBold", textAlign: "center" },
  emptyDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium", textAlign: "center" },
});
