import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { CustomerBottomDrawer } from "@/components/ui/customer-bottom-drawer";
import { PrimaryButton, SecondaryButton } from "@/components/ui/nwc-ui";
import type { MockDirectoryItem } from "@/lib/mock-account-directory";
import { nwcColors } from "@/lib/nwc-theme";

type DirectoryEntryModalProps = { visible: boolean; item: MockDirectoryItem | null; itemLabel: string; itemDetail: string; onDismiss: () => void; onSave: (item: { id?: string; label: string; detail: string }) => void };

export function DirectoryEntryModal({ visible, item, itemLabel, itemDetail, onDismiss, onSave }: DirectoryEntryModalProps) {
  const [label, setLabel] = useState("");
  const [detail, setDetail] = useState("");
  useEffect(() => { if (visible) { setLabel(item?.label ?? ""); setDetail(item?.detail ?? ""); } }, [item, visible]);
  const save = () => { if (!label.trim() || !detail.trim()) return; onSave({ id: item?.id || undefined, label: label.trim(), detail: detail.trim() }); };
  return <CustomerBottomDrawer visible={visible} overline="Recipient" title={item?.id ? "Edit recipient" : "Add recipient"} detail="Save the details needed for a faster booking later." initialSnap="half" onDismiss={onDismiss} footer={<View style={styles.actions}><SecondaryButton label="Cancel" onPress={onDismiss} style={styles.action} /><PrimaryButton label="Save recipient" icon="check" disabled={!label.trim() || !detail.trim()} onPress={save} style={styles.action} /></View>}><TextInput accessibilityLabel={itemLabel} value={label} onChangeText={setLabel} placeholder={itemLabel} placeholderTextColor="#91A0AE" returnKeyType="next" style={styles.input} /><TextInput accessibilityLabel={itemDetail} value={detail} onChangeText={setDetail} placeholder={itemDetail} placeholderTextColor="#91A0AE" returnKeyType="done" style={styles.input} /></CustomerBottomDrawer>;
}

const styles = StyleSheet.create({
  input: { minHeight: 50, paddingHorizontal: 13, borderRadius: 15, borderWidth: 1, borderColor: "#DCE6E8", backgroundColor: nwcColors.surfaceElevated, color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_600SemiBold" }, actions: { flexDirection: "row", gap: 9 }, action: { flex: 1 },
});
