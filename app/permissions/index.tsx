import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, Screen, SectionHeader, StatusBadge } from "@/components/ui/nwc-ui";
import { mockPermissions, permissionStatusLabel, type MockPermission } from "@/lib/mock-permissions";
import { nwcColors } from "@/lib/nwc-theme";
import { useMockPermissions } from "@/stores/mock-permissions";

const permissionKeys = Object.keys(mockPermissions) as MockPermission[];

export default function PermissionsScreen() {
  const { statuses } = useMockPermissions();
  return <Screen><View style={styles.page}><View style={styles.header}><View><Text style={styles.eyebrow}>Customer controls</Text><SectionHeader title="Permissions" /></View><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /></View><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.notice}><AppIcon name="shield-check-outline" size={22} color={nwcColors.info} /><Text style={styles.noticeText}>New WorldCargo asks for access only when you choose a feature that needs it. Every flow has a manual alternative.</Text></View>{permissionKeys.map((permission) => { const item = mockPermissions[permission]; const status = statuses[permission]; const tone = status === "granted" ? "success" : status === "denied" ? "warning" : "neutral"; return <TouchableOpacity key={permission} accessibilityRole="button" accessibilityLabel={`Manage ${item.title} permission`} accessibilityHint={`${permissionStatusLabel(status)}. ${item.summary}`} onPress={() => router.push(`/permissions/${permission}` as Href)} activeOpacity={0.77}><Card style={styles.card}><View style={styles.cardIcon}><AppIcon name={item.icon} size={22} color={nwcColors.brandNavy} /></View><View style={styles.cardCopy}><Text style={styles.cardTitle}>{item.title}</Text><Text style={styles.cardDetail}>{item.summary}</Text><StatusBadge label={permissionStatusLabel(status)} tone={tone} /></View><AppIcon name="chevron-right" size={22} color={nwcColors.muted} /></Card></TouchableOpacity>; })}</ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingTop: 16, paddingHorizontal: 20 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 2 },
  content: { gap: 11, paddingTop: 14, paddingBottom: 30 },
  notice: { flexDirection: "row", alignItems: "flex-start", gap: 10, padding: 14, borderRadius: 16, backgroundColor: "#EAF4F8", marginBottom: 2 },
  noticeText: { flex: 1, color: nwcColors.info, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_600SemiBold" },
  card: { minHeight: 90, flexDirection: "row", gap: 12, alignItems: "center" },
  cardIcon: { width: 46, height: 46, borderRadius: 15, justifyContent: "center", alignItems: "center", backgroundColor: "#EAF1F4" },
  cardCopy: { flex: 1, gap: 3 },
  cardTitle: { color: nwcColors.foreground, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
  cardDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_500Medium" },
});
