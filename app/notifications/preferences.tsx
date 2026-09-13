import { useState } from "react";
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { CustomerConfirmationDialog } from "@/components/ui/customer-confirmation-dialog";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { IconButton, PrimaryButton, Screen, StatusBadge } from "@/components/ui/nwc-ui";
import type { NotificationPreferences } from "@/lib/domain/notifications";
import { nwcColors } from "@/lib/nwc-theme";
import { useNotificationPreferences } from "@/stores/notification-preferences";

type PreferenceRowProps = {
  icon: AppIconName;
  title: string;
  detail: string;
  enabled: boolean;
  onValueChange: (value: boolean) => void;
};

function PreferenceRow({ icon, title, detail, enabled, onValueChange }: PreferenceRowProps) {
  return <View style={styles.preferenceRow}><View style={styles.rowIcon}><AppIcon name={icon} size={20} color={nwcColors.brandNavy} /></View><View style={styles.rowCopy}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowDetail}>{detail}</Text></View><Switch accessibilityLabel={`${title} notifications`} accessibilityHint={detail} value={enabled} onValueChange={onValueChange} trackColor={{ false: "#DDE6E9", true: nwcColors.brandNavy }} thumbColor={nwcColors.white} /></View>;
}

export default function NotificationPreferencesScreen() {
  const { preferences, status, errorMessage, pushRegistered, setPreference, setAllPreferences, savePreferences, enablePushNotifications } = useNotificationPreferences();
  const [saved, setSaved] = useState(false);
  const [confirmPause, setConfirmPause] = useState(false);
  const allPaused = !preferences.shipmentUpdates && !preferences.billUpdates && !preferences.marketing;
  const saving = status === "saving";

  const updatePreference = (key: keyof NotificationPreferences, value: boolean) => {
    setPreference(key, value);
    setSaved(false);
  };

  const save = async () => {
    const ok = await savePreferences();
    setSaved(ok);
    if (ok && (preferences.shipmentUpdates || preferences.billUpdates) && !pushRegistered) {
      await enablePushNotifications();
    }
  };
  const pauseAll = async () => {
    const paused = { shipmentUpdates: false, billUpdates: false, marketing: false };
    setAllPreferences(false);
    setConfirmPause(false);
    const ok = await savePreferences(paused);
    setSaved(ok);
  };

  return <Screen><View style={styles.page}><View style={styles.header}><View style={styles.headerCopy}><Text style={styles.eyebrow}>Preferences</Text><Text style={styles.title}>Notification settings</Text><Text style={styles.summary}>Choose the updates you want to receive.</Text></View><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /></View><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.statusRow}><StatusBadge label={allPaused ? "Updates paused" : pushRegistered ? "Push ready" : "Updates active"} tone={allPaused ? "warning" : "success"} icon={allPaused ? "bell-off-outline" : "check"} /><Text style={styles.statusDetail}>{allPaused ? "You can turn delivery updates back on anytime." : pushRegistered ? "This device is registered for cargo alerts." : "Save to register this device for cargo alerts."}</Text></View>{errorMessage ? <View style={styles.errorBanner}><AppIcon name="alert-circle-outline" size={18} color={nwcColors.error} /><Text style={styles.errorText}>{errorMessage}</Text></View> : null}<Section title="Cargo updates" detail="Useful updates about the shipments you are sending or receiving."><PreferenceRow icon="truck-fast-outline" title="Shipment updates" detail="Pickup, transit, delivery, and exception updates." enabled={preferences.shipmentUpdates} onValueChange={(value) => updatePreference("shipmentUpdates", value)} /><View style={styles.divider} /><PreferenceRow icon="receipt-text-outline" title="Bills and payments" detail="Invoices, payment status, receipts, and refunds." enabled={preferences.billUpdates} onValueChange={(value) => updatePreference("billUpdates", value)} /></Section><Section title="From New WorldCargo" detail="Optional news and offers. These never replace cargo updates."><PreferenceRow icon="tag-outline" title="Offers and news" detail="Occasional service updates and promotions." enabled={preferences.marketing} onValueChange={(value) => updatePreference("marketing", value)} /></Section><TouchableOpacity accessibilityRole="button" accessibilityLabel="Pause all notifications" accessibilityHint="Opens a confirmation before pausing all delivery and billing updates" disabled={allPaused || saving} activeOpacity={0.72} onPress={() => setConfirmPause(true)} style={[styles.pauseAll, (allPaused || saving) && styles.pauseAllDisabled]}><AppIcon name="bell-off-outline" size={19} color={nwcColors.error} /><Text style={styles.pauseAllText}>{allPaused ? "All notifications are paused" : "Pause all notifications"}</Text></TouchableOpacity></ScrollView><View style={styles.footer}><PrimaryButton label={saving ? "Saving..." : saved ? "Preferences saved" : "Save preferences"} icon={saved ? "check" : "content-save-outline"} disabled={saving} onPress={save} /></View><CustomerConfirmationDialog visible={confirmPause} title="Pause all notifications?" detail="You will not receive shipment, billing, or offer notifications until you turn them back on." approveLabel="Pause all" tone="danger" onApprove={pauseAll} onDismiss={() => setConfirmPause(false)} /></View></Screen>;
}

function Section({ title, detail, children }: { title: string; detail: string; children: React.ReactNode }) {
  return <View style={styles.section}><View style={styles.sectionCopy}><Text style={styles.sectionTitle}>{title}</Text><Text style={styles.sectionDetail}>{detail}</Text></View><View style={styles.sectionCard}>{children}</View></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  header: { paddingHorizontal: 20, paddingTop: 16, flexDirection: "row", gap: 14, justifyContent: "space-between", alignItems: "flex-start" },
  headerCopy: { flex: 1, gap: 2 },
  eyebrow: { color: nwcColors.warning, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.9, textTransform: "uppercase" },
  title: { color: nwcColors.foreground, fontSize: 28, lineHeight: 36, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.5 },
  summary: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 130, gap: 22 },
  statusRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  statusDetail: { flex: 1, color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" },
  errorBanner: { minHeight: 48, borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: "#FFF4F4", borderWidth: 1, borderColor: "#F8DCDC", flexDirection: "row", alignItems: "center", gap: 8 },
  errorText: { flex: 1, color: nwcColors.error, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_600SemiBold" },
  section: { gap: 9 },
  sectionCopy: { gap: 1 },
  sectionTitle: { color: nwcColors.foreground, fontSize: 17, lineHeight: 23, fontFamily: "Poppins_800ExtraBold" },
  sectionDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_500Medium" },
  sectionCard: { backgroundColor: nwcColors.surface, borderWidth: 1, borderColor: "#E3E9EB", borderRadius: 23, paddingHorizontal: 14 },
  preferenceRow: { minHeight: 82, flexDirection: "row", alignItems: "center", gap: 11 },
  rowIcon: { width: 40, height: 40, borderRadius: 14, backgroundColor: "#EDF5F7", alignItems: "center", justifyContent: "center" },
  rowCopy: { flex: 1, gap: 2 },
  rowTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  rowDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" },
  divider: { height: 1, backgroundColor: nwcColors.border, marginLeft: 51 },
  pauseAll: { minHeight: 52, borderRadius: 20, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, backgroundColor: "#FFF4F4", borderWidth: 1, borderColor: "#F8DCDC" },
  pauseAllDisabled: { opacity: 0.52 },
  pauseAllText: { color: nwcColors.error, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, backgroundColor: nwcColors.background, borderTopWidth: 1, borderTopColor: "#E8EDEE" },
});
