import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

import { AppIcon } from "@/components/ui/app-icon";
import { PrimaryButton, SecondaryButton } from "@/components/ui/nwc-ui";
import type { MockDirectoryItem } from "@/lib/mock-account-directory";
import { nwcColors } from "@/lib/nwc-theme";

type DirectoryEntryModalProps = { visible: boolean; item: MockDirectoryItem | null; itemLabel: string; itemDetail: string; onDismiss: () => void; onSave: (item: { id?: string; label: string; detail: string }) => void };

export function DirectoryEntryModal({ visible, item, itemLabel, itemDetail, onDismiss, onSave }: DirectoryEntryModalProps) {
  const [label, setLabel] = useState("");
  const [detail, setDetail] = useState("");
  useEffect(() => { if (visible) { setLabel(item?.label ?? ""); setDetail(item?.detail ?? ""); } }, [item, visible]);
  const save = () => { if (!label.trim() || !detail.trim()) return; onSave({ id: item?.id || undefined, label: label.trim(), detail: detail.trim() }); };
  return <Modal transparent visible={visible} animationType="fade" onRequestClose={onDismiss} statusBarTranslucent><View style={styles.backdrop}><TouchableOpacity accessibilityRole="button" accessibilityLabel="Close recipient editor" onPress={onDismiss} style={styles.dismiss} /><KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.center}><View accessibilityViewIsModal style={styles.modal}><View style={styles.titleRow}><View style={styles.modalIcon}><AppIcon name="account-plus-outline" size={22} color={nwcColors.primaryInk} /></View><TouchableOpacity accessibilityRole="button" accessibilityLabel="Close recipient editor" onPress={onDismiss} style={styles.close}><AppIcon name="close" size={19} color={nwcColors.brandNavy} /></TouchableOpacity></View><Text style={styles.title}>{item?.id ? "Edit recipient" : "Add recipient"}</Text><Text style={styles.detail}>Save the details needed for a faster booking later.</Text><TextInput accessibilityLabel={itemLabel} value={label} onChangeText={setLabel} placeholder={itemLabel} placeholderTextColor="#91A0AE" returnKeyType="next" style={styles.input} /><TextInput accessibilityLabel={itemDetail} value={detail} onChangeText={setDetail} placeholder={itemDetail} placeholderTextColor="#91A0AE" returnKeyType="done" style={styles.input} /><View style={styles.actions}><SecondaryButton label="Cancel" onPress={onDismiss} /><PrimaryButton label="Save recipient" icon="check" disabled={!label.trim() || !detail.trim()} onPress={save} /></View></View></KeyboardAvoidingView></View></Modal>;
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: "center", paddingHorizontal: 24, backgroundColor: "rgba(1,38,66,0.42)" }, dismiss: { ...StyleSheet.absoluteFillObject }, center: { width: "100%" }, modal: { borderRadius: 28, padding: 18, backgroundColor: nwcColors.background, gap: 10, shadowColor: "#012642", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.2, shadowRadius: 24, elevation: 12 }, titleRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" }, modalIcon: { width: 43, height: 43, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary }, close: { width: 38, height: 38, borderRadius: 13, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.surfaceRaised }, title: { color: nwcColors.foreground, fontSize: 23, lineHeight: 29, fontFamily: "Poppins_800ExtraBold" }, detail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_500Medium", marginBottom: 2 }, input: { minHeight: 48, paddingHorizontal: 13, borderRadius: 15, borderWidth: 1, borderColor: "#DCE6E8", backgroundColor: nwcColors.surfaceElevated, color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_600SemiBold" }, actions: { flexDirection: "row", gap: 9, marginTop: 2 },
});
