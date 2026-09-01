import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { DirectoryEntryModal } from "@/components/account/directory-entry-modal";
import { LocationFinderDrawer } from "@/components/account/location-finder-drawer";
import { CustomerConfirmationDialog } from "@/components/ui/customer-confirmation-dialog";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, PrimaryButton, Screen } from "@/components/ui/nwc-ui";
import { getCustomerApprovalPresentation } from "@/lib/customer-approval";
import type { MockDirectoryItem, MockDirectoryKind } from "@/lib/mock-account-directory";
import { getDirectoryEditorPresentation } from "@/lib/account-directory-presentation";
import { nwcColors } from "@/lib/nwc-theme";
import { useMockAccountDirectory } from "@/stores/mock-account-directory";

type DirectoryScreenProps = { kind: MockDirectoryKind; title: string; heading: string; detail: string; itemLabel: string; itemDetail: string; icon: "map-marker-outline" | "account-multiple-outline" };

export function AccountDirectoryScreen({ kind, title, heading, detail, itemLabel, itemDetail, icon }: DirectoryScreenProps) {
  const { savedPlaces, recipients, saveDirectoryItem, removeDirectoryItem } = useMockAccountDirectory();
  const items = kind === "places" ? savedPlaces : recipients;
  const [editing, setEditing] = useState<MockDirectoryItem | null>(null);
  const [removing, setRemoving] = useState<MockDirectoryItem | null>(null);
  const presentation = getDirectoryEditorPresentation(kind);
  const beginEdit = (item?: MockDirectoryItem) => setEditing(item ?? { id: "", label: "", detail: "" });
  const save = (item: { id?: string; label: string; detail: string }) => { saveDirectoryItem(kind, item); setEditing(null); };
  const removal = getCustomerApprovalPresentation("remove-directory-item", removing?.label);
  return <Screen><View style={styles.page}><View style={styles.header}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={styles.headerTitle}>{title}</Text><View style={styles.headerSpacer} /></View><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}><View style={styles.titleBlock}><Text style={styles.title}>{heading}</Text><Text style={styles.detail}>{detail}</Text></View><PrimaryButton label={`Add ${itemLabel.toLowerCase()}`} icon="plus" onPress={() => beginEdit()} />{items.length ? <View style={styles.list}>{items.map((item) => <Card key={item.id} style={styles.item}><View style={styles.itemIcon}><AppIcon name={icon} size={21} color={nwcColors.brandNavy} /></View><View style={styles.itemCopy}><Text style={styles.itemTitle}>{item.label}</Text><Text style={styles.itemDetail}>{item.detail}</Text></View><View style={styles.itemActions}><TouchableOpacity accessibilityRole="button" accessibilityLabel={`Edit ${item.label}`} onPress={() => beginEdit(item)} style={styles.action}><Text style={styles.editText}>Edit</Text></TouchableOpacity><TouchableOpacity accessibilityRole="button" accessibilityLabel={`Remove ${item.label}`} onPress={() => setRemoving(item)} style={styles.action}><Text style={styles.removeText}>Remove</Text></TouchableOpacity></View></Card>)}</View> : <Card style={styles.empty}><View style={styles.emptyIcon}><AppIcon name={icon} size={24} color={nwcColors.primaryInk} /></View><Text style={styles.emptyTitle}>No {title.toLowerCase()} yet</Text><Text style={styles.emptyDetail}>Add one now so it is ready to use in a future booking.</Text></Card>}</ScrollView>{presentation === "location-drawer" ? <LocationFinderDrawer visible={Boolean(editing)} item={editing} onDismiss={() => setEditing(null)} onSave={save} /> : <DirectoryEntryModal visible={Boolean(editing)} item={editing} itemLabel={itemLabel} itemDetail={itemDetail} onDismiss={() => setEditing(null)} onSave={save} />}<CustomerConfirmationDialog visible={Boolean(removing)} {...removal} onDismiss={() => setRemoving(null)} onApprove={() => { if (removing) removeDirectoryItem(kind, removing.id); setRemoving(null); }} /></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingTop: 16, paddingHorizontal: 20, backgroundColor: nwcColors.background }, header: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerTitle: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" }, headerSpacer: { width: 44, height: 44 }, content: { paddingTop: 24, paddingBottom: 42, gap: 16 }, titleBlock: { gap: 4 }, title: { color: nwcColors.foreground, fontSize: 29, lineHeight: 37, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.5 }, detail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium" }, list: { gap: 9 }, item: { minHeight: 78, padding: 12, flexDirection: "row", alignItems: "center", gap: 10 }, itemIcon: { width: 42, height: 42, borderRadius: 14, justifyContent: "center", alignItems: "center", backgroundColor: nwcColors.surfaceNavyTint }, itemCopy: { minWidth: 0, flex: 1, gap: 2 }, itemTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" }, itemDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" }, itemActions: { alignItems: "flex-end", gap: 3 }, action: { minHeight: 23, justifyContent: "center", paddingHorizontal: 2 }, editText: { color: nwcColors.info, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold" }, removeText: { color: nwcColors.error, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold" }, empty: { alignItems: "center", gap: 6, paddingVertical: 26 }, emptyIcon: { width: 52, height: 52, borderRadius: 18, justifyContent: "center", alignItems: "center", backgroundColor: nwcColors.primary }, emptyTitle: { color: nwcColors.foreground, fontSize: 16, lineHeight: 22, fontFamily: "Poppins_800ExtraBold" }, emptyDetail: { color: nwcColors.muted, maxWidth: 260, textAlign: "center", fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
});
