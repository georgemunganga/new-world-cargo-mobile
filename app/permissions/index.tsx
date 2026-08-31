import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Screen } from "@/components/ui/nwc-ui";
import { mockPermissions, permissionStatusLabel, type MockPermission } from "@/lib/mock-permissions";
import { nwcColors } from "@/lib/nwc-theme";
import { useMockPermissions } from "@/stores/mock-permissions";

const permissionKeys = Object.keys(mockPermissions) as MockPermission[];

export default function PermissionsScreen() {
  const { statuses } = useMockPermissions();
  return <Screen><View style={styles.page}><View style={styles.header}><TouchableOpacity accessibilityRole="button" accessibilityLabel="Go back" onPress={() => router.back()} style={styles.back}><AppIcon name="arrow-left" size={21} color={nwcColors.brandNavy} /></TouchableOpacity><View><Text style={styles.title}>Permissions</Text><Text style={styles.detail}>You choose when to allow access.</Text></View></View><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>{permissionKeys.map((permission) => { const item = mockPermissions[permission]; const status = statuses[permission]; const allowed = status === "granted"; return <TouchableOpacity key={permission} accessibilityRole="button" accessibilityLabel={`Open ${item.title} permission`} onPress={() => router.push(`/permissions/${permission}` as Href)} style={styles.card}><View style={[styles.iconWrap, allowed && styles.iconWrapAllowed]}><AppIcon name={item.icon} size={22} color={allowed ? nwcColors.primaryInk : nwcColors.brandNavy} /></View><View style={styles.copy}><Text style={styles.cardTitle}>{item.title}</Text><Text numberOfLines={2} style={styles.summary}>{item.summary}</Text></View><View style={[styles.status, allowed && styles.statusAllowed]}><Text style={[styles.statusText, allowed && styles.statusTextAllowed]}>{permissionStatusLabel(status)}</Text></View><AppIcon name="chevron-right" size={19} color={nwcColors.muted} /></TouchableOpacity>; })}</ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  header: { paddingHorizontal: 20, paddingTop: 21, paddingBottom: 16, flexDirection: "row", alignItems: "center", gap: 12 },
  back: { width: 44, height: 44, borderRadius: 15, backgroundColor: nwcColors.white, borderWidth: 1, borderColor: nwcColors.border, alignItems: "center", justifyContent: "center" },
  title: { color: nwcColors.foreground, fontSize: 23, lineHeight: 29, fontFamily: "Poppins_800ExtraBold" },
  detail: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_500Medium" },
  content: { paddingHorizontal: 20, paddingBottom: 38, gap: 10 },
  card: { minHeight: 85, padding: 12, borderWidth: 1, borderColor: "#E6ECEE", borderRadius: 20, backgroundColor: nwcColors.white, flexDirection: "row", alignItems: "center", gap: 10 },
  iconWrap: { width: 46, height: 46, borderRadius: 16, backgroundColor: "#EDF3F5", alignItems: "center", justifyContent: "center" },
  iconWrapAllowed: { backgroundColor: nwcColors.primary },
  copy: { flex: 1, gap: 2 },
  cardTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  summary: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" },
  status: { position: "absolute", right: 36, top: 13, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 8, backgroundColor: "#F1F4F5" },
  statusAllowed: { backgroundColor: "#FFF0B5" },
  statusText: { color: nwcColors.muted, fontSize: 9, lineHeight: 12, fontFamily: "Poppins_700Bold" },
  statusTextAllowed: { color: nwcColors.primaryInk },
});
