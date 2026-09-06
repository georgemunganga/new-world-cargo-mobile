import type { PropsWithChildren, ReactNode } from "react";
import { StyleSheet, View } from "react-native";

import { type AppIconName } from "@/components/ui/app-icon";
import { CustomerBottomDrawer } from "@/components/ui/customer-bottom-drawer";
import { PrimaryButton, SecondaryButton } from "@/components/ui/nwc-ui";

type FullScreenFormDrawerProps = PropsWithChildren<{ visible: boolean; overline: string; title: string; detail: string; approveLabel: string; approveIcon?: AppIconName; approveDisabled?: boolean; onApprove: () => void; onDismiss: () => void; footerNote?: ReactNode }>;

export function FullScreenFormDrawer({ visible, overline, title, detail, approveLabel, approveIcon = "check", approveDisabled, onApprove, onDismiss, footerNote, children }: FullScreenFormDrawerProps) {
  return <CustomerBottomDrawer visible={visible} overline={overline} title={title} detail={detail} initialSnap="expanded" onDismiss={onDismiss} footer={<View style={styles.footerContent}>{footerNote ? <View style={styles.footerNote}>{footerNote}</View> : null}<View style={styles.actions}><SecondaryButton label="Cancel" onPress={onDismiss} style={styles.action} /><PrimaryButton label={approveLabel} icon={approveIcon} disabled={approveDisabled} onPress={onApprove} style={styles.action} /></View></View>}>{children}</CustomerBottomDrawer>;
}

const styles = StyleSheet.create({
  footerContent: { gap: 9 }, footerNote: { alignItems: "center" }, actions: { flexDirection: "row", gap: 9 }, action: { flex: 1 },
});
