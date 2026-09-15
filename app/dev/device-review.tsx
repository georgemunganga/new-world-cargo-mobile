import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { deviceReviewChecks, nextDeviceReviewStatus, type DeviceReviewStatus } from "@/lib/device-review";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton, Screen, SectionHeader, StatusBadge } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

const statusLabel: Record<DeviceReviewStatus, string> = { "not-tested": "Not tested", pass: "Pass", issue: "Issue" };
const statusTone: Record<DeviceReviewStatus, "neutral" | "success" | "warning"> = { "not-tested": "neutral", pass: "success", issue: "warning" };

export default function DeviceReviewScreen() {
  const [results, setResults] = useState<Record<string, DeviceReviewStatus>>({});
  const completed = useMemo(() => deviceReviewChecks.filter((check) => results[check.id] && results[check.id] !== "not-tested").length, [results]);
  const update = (id: string) => setResults((current) => ({ ...current, [id]: nextDeviceReviewStatus(current[id] ?? "not-tested") }));
  return <Screen><View style={styles.page}><View style={styles.header}><View><SectionHeader title="Device review" /></View><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /></View><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.banner}><AppIcon name="cellphone-check" size={22} color={nwcColors.primaryInk} /><View style={styles.bannerCopy}><Text style={styles.bannerTitle}>Review on a real phone</Text><Text style={styles.bannerText}>This checklist is manual. Open the app in Expo Go, test each item, then tap a row here to cycle Not tested → Pass → Issue.</Text></View></View><View style={styles.progress}><Text style={styles.progressText}>{`${completed} of ${deviceReviewChecks.length} checks reviewed`}</Text><StatusBadge label="Manual QA" tone="info" icon="clipboard-check-outline" /></View>{["Layout", "Accessibility", "Forms", "Recovery", "Maps", "System", "Documents"].map((area) => { const checks = deviceReviewChecks.filter((check) => check.area === area); if (!checks.length) return null; return <View key={area} style={styles.section}><Text style={styles.sectionTitle}>{area}</Text><View style={styles.card}>{checks.map((check, index) => { const status = results[check.id] ?? "not-tested"; return <TouchableOpacity key={check.id} accessibilityRole="button" accessibilityLabel={`${check.title}: ${statusLabel[status]}`} accessibilityHint={`${check.instruction} Double tap to change review status.`} onPress={() => update(check.id)} activeOpacity={0.74} style={[styles.row, index < checks.length - 1 && styles.rowBorder]}><View style={styles.rowCopy}><Text style={styles.rowTitle}>{check.title}</Text><Text style={styles.rowDetail}>{check.instruction}</Text></View><StatusBadge label={statusLabel[status]} tone={statusTone[status]} icon={status === "pass" ? "check" : status === "issue" ? "alert-circle-outline" : "clock-outline"} /></TouchableOpacity>; })}</View></View>; })}</ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 16 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  eyebrow: { color: nwcColors.info, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 2 },
  content: { gap: 20, paddingTop: 14, paddingBottom: 34 },
  banner: { flexDirection: "row", alignItems: "flex-start", gap: 11, borderRadius: 20, padding: 15, backgroundColor: "#EAF4F8" },
  bannerCopy: { flex: 1, gap: 3 },
  bannerTitle: { color: nwcColors.foreground, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
  bannerText: { color: nwcColors.info, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
  progress: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 },
  progressText: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_700Bold" },
  section: { gap: 8 },
  sectionTitle: { color: nwcColors.muted, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.6, textTransform: "uppercase" },
  card: { borderWidth: 1, borderColor: "#E1E9EB", borderRadius: 22, backgroundColor: nwcColors.surface, paddingHorizontal: 14 },
  row: { minHeight: 88, paddingVertical: 13, flexDirection: "row", alignItems: "center", gap: 12 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: nwcColors.border },
  rowCopy: { flex: 1, gap: 3 },
  rowTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  rowDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" },
});
