import { StyleSheet, Switch, Text, View } from "react-native";
import { router } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, Screen, SectionHeader } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";
import { useNotificationPreferences } from "@/stores/notification-preferences";

export default function NotificationPreferencesScreen() {
  const { preferences, setPreference } = useNotificationPreferences();
  return <Screen><View style={styles.page}><View style={styles.header}><View><Text style={styles.eyebrow}>Customer controls</Text><SectionHeader title="Notification preferences" /></View><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /></View><View style={styles.content}><View style={styles.notice}><AppIcon name="bell-outline" size={21} color={nwcColors.info} /><Text style={styles.noticeText}>Operational updates and marketing messages are always shown separately. Changes below affect this frontend preview only.</Text></View><Text style={styles.groupTitle}>Operational updates</Text><Card style={styles.card}><PreferenceRow icon="truck-fast-outline" title="Shipment and delivery updates" detail="Booking, pickup, in-transit, collection, and delivery messages." value={preferences.shipmentUpdates} onValueChange={(value) => setPreference("shipmentUpdates", value)} /><View style={styles.divider} /><PreferenceRow icon="receipt-text-outline" title="Bills and payment updates" detail="Invoice, payment confirmation, receipt, and refund messages." value={preferences.billUpdates} onValueChange={(value) => setPreference("billUpdates", value)} /></Card><Text style={styles.groupTitle}>News and offers</Text><Card style={styles.card}><PreferenceRow icon="bullhorn-outline" title="New WorldCargo news" detail="Service announcements, offers, and helpful cargo tips." value={preferences.marketing} onValueChange={(value) => setPreference("marketing", value)} /></Card><View style={styles.signedOut}><AppIcon name="account-lock-outline" size={20} color={nwcColors.warning} /><Text style={styles.signedOutText}>If you receive a shipment link while signed out, New WorldCargo will first ask you to verify your phone number before opening private cargo or payment information.</Text></View></View></View></Screen>;
}

function PreferenceRow({ icon, title, detail, value, onValueChange }: { icon: "truck-fast-outline" | "receipt-text-outline" | "bullhorn-outline"; title: string; detail: string; value: boolean; onValueChange: (value: boolean) => void }) { return <View style={styles.preferenceRow}><View style={styles.preferenceIcon}><AppIcon name={icon} size={21} color={nwcColors.brandNavy} /></View><View style={styles.preferenceCopy}><Text style={styles.preferenceTitle}>{title}</Text><Text style={styles.preferenceDetail}>{detail}</Text></View><Switch accessibilityLabel={title} accessibilityHint={detail} value={value} onValueChange={onValueChange} trackColor={{ false: "#DCE4E8", true: "#D3A72D" }} thumbColor={value ? nwcColors.primary : "#FFFFFF"} /></View>; }

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingTop: 16, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 2 },
  content: { gap: 14, paddingTop: 14 },
  notice: { flexDirection: "row", alignItems: "flex-start", gap: 9, padding: 14, backgroundColor: "#EAF4F8", borderRadius: 16 },
  noticeText: { flex: 1, color: nwcColors.info, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_600SemiBold" },
  groupTitle: { color: nwcColors.foreground, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold", marginTop: 5 },
  card: { paddingVertical: 3 },
  preferenceRow: { minHeight: 82, flexDirection: "row", alignItems: "center", gap: 11, paddingVertical: 10 },
  preferenceIcon: { height: 42, width: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#EAF1F4" },
  preferenceCopy: { flex: 1, gap: 2 },
  preferenceTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  preferenceDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" },
  divider: { height: 1, backgroundColor: nwcColors.border, marginLeft: 53 },
  signedOut: { flexDirection: "row", alignItems: "flex-start", gap: 9, padding: 14, backgroundColor: "#FBF0D8", borderRadius: 16, marginTop: 4 },
  signedOutText: { flex: 1, color: nwcColors.warning, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_600SemiBold" },
});
