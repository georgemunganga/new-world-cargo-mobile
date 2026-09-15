import { MobileInput } from "@/components/ui/mobile-input";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { CustomerBottomDrawer } from "@/components/ui/customer-bottom-drawer";
import { PrimaryButton, SecondaryButton } from "@/components/ui/nwc-ui";
import type { AddressBookItem } from "@/lib/domain/address-book";
import { nwcColors } from "@/lib/nwc-theme";

type DirectoryEntryModalProps = { visible: boolean; item: AddressBookItem | null; itemLabel: string; itemDetail: string; onDismiss: () => void; onSave: (item: { id?: string; label: string; detail: string }) => void };

export function DirectoryEntryModal({ visible, item, itemLabel, itemDetail, onDismiss, onSave }: DirectoryEntryModalProps) {
  const [label, setLabel] = useState("");
  const [detail, setDetail] = useState("");
  useEffect(() => { if (visible) { setLabel(item?.label ?? ""); setDetail(item?.detail ?? ""); } }, [item, visible]);
  const save = () => { if (!label.trim() || !detail.trim()) return; onSave({ id: item?.id || undefined, label: label.trim(), detail: detail.trim() }); };
  return <CustomerBottomDrawer visible={visible} overline="Recipient" title={item?.id ? "Edit recipient" : "Add recipient"} detail="Save the details needed for a faster booking later." initialSnap="half" onDismiss={onDismiss} footer={<View style={styles.actions}><SecondaryButton label="Cancel" onPress={onDismiss} style={styles.action} /><PrimaryButton label="Save recipient" icon="check" disabled={!label.trim() || !detail.trim()} onPress={save} style={styles.action} /></View>}><MobileInput label={itemLabel} value={label} onChangeText={setLabel} returnKeyType="next" /><MobileInput label={itemDetail} value={detail} onChangeText={setDetail} returnKeyType="done" /></CustomerBottomDrawer>;
}

const styles = StyleSheet.create({
  input: { minHeight: 50, paddingHorizontal: 13, borderRadius: 15, borderWidth: 1, borderColor: "#DCE6E8", backgroundColor: nwcColors.surfaceElevated, color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_600SemiBold" }, actions: { flexDirection: "row", gap: 9 }, action: { flex: 1 },
});
