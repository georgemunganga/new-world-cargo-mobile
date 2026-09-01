import { Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppIcon } from "@/components/ui/app-icon";
import { SecondaryButton } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

type CustomerConfirmationDialogProps = { visible: boolean; title: string; detail: string; approveLabel: string; tone?: "primary" | "danger"; onApprove: () => void; onDismiss: () => void };

export function CustomerConfirmationDialog({ visible, title, detail, approveLabel, tone = "primary", onApprove, onDismiss }: CustomerConfirmationDialogProps) {
  const insets = useSafeAreaInsets();
  return <Modal transparent visible={visible} animationType="fade" onRequestClose={onDismiss} statusBarTranslucent><View style={styles.backdrop}><TouchableOpacity accessibilityRole="button" accessibilityLabel={`Dismiss ${title}`} onPress={onDismiss} style={styles.dismiss} /><View accessibilityViewIsModal style={[styles.dialog, { marginBottom: Math.max(insets.bottom, 18) }]}><View style={[styles.icon, tone === "danger" && styles.iconDanger]}><AppIcon name={tone === "danger" ? "alert-circle-outline" : "check-circle"} size={24} color={tone === "danger" ? nwcColors.error : nwcColors.primaryInk} /></View><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text><View style={styles.actions}><SecondaryButton label="Cancel" onPress={onDismiss} style={styles.action} /><TouchableOpacity accessibilityRole="button" accessibilityLabel={approveLabel} activeOpacity={0.78} onPress={onApprove} style={[styles.approve, tone === "danger" && styles.approveDanger]}><Text style={[styles.approveText, tone === "danger" && styles.approveTextDanger]}>{approveLabel}</Text></TouchableOpacity></View></View></View></Modal>;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "flex-end", paddingHorizontal: 20, backgroundColor: "rgba(1,38,66,0.42)" }, dismiss: { ...StyleSheet.absoluteFillObject }, dialog: { position: "relative", alignItems: "center", borderRadius: 28, padding: 20, gap: 9, backgroundColor: nwcColors.surfaceElevated }, icon: { width: 50, height: 50, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary }, iconDanger: { backgroundColor: "#FFF0F0" }, title: { color: nwcColors.foreground, fontSize: 19, lineHeight: 25, textAlign: "center", fontFamily: "Poppins_800ExtraBold" }, detail: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, textAlign: "center", fontFamily: "Poppins_500Medium" }, actions: { width: "100%", marginTop: 5, flexDirection: "row", gap: 9 }, action: { flex: 1 }, approve: { flex: 1, minHeight: 50, borderRadius: 20, alignItems: "center", justifyContent: "center", paddingHorizontal: 12, backgroundColor: nwcColors.primary }, approveDanger: { backgroundColor: nwcColors.error }, approveText: { color: nwcColors.primaryInk, fontSize: 13, lineHeight: 18, textAlign: "center", fontFamily: "Poppins_800ExtraBold" }, approveTextDanger: { color: nwcColors.white },
});
