import { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@/components/ui/app-icon";
import { IconButton, PrimaryButton, Screen, StatusBadge } from "@/components/ui/nwc-ui";
import { type LegalDocument } from "@/lib/legal-documents";
import { nwcColors } from "@/lib/nwc-theme";

export function LegalDocumentScreen({ document }: { document: LegalDocument }) {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [acknowledged, setAcknowledged] = useState(false);
  const visibleSections = useMemo(() => selectedSection ? document.sections.filter((section) => section.id === selectedSection) : document.sections, [document.sections, selectedSection]);
  return <Screen><View style={styles.page}><View style={styles.header}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text numberOfLines={1} style={styles.headerTitle}>{document.shortTitle}</Text><View style={styles.headerSpacer} /></View><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.lead}><Text style={styles.eyebrow}>New WorldCargo policy</Text><Text style={styles.title}>{document.title}</Text><Text style={styles.summary}>{document.summary}</Text><StatusBadge label={document.effectiveDate} tone="warning" icon="alert-circle-outline" /></View><View style={styles.contents}><Text style={styles.contentsLabel}>On this page</Text><ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chips}><TopicChip label="All" selected={!selectedSection} onPress={() => setSelectedSection(null)} />{document.sections.map((section) => <TopicChip key={section.id} label={section.title} selected={selectedSection === section.id} onPress={() => setSelectedSection(section.id)} />)}</ScrollView></View><View style={styles.documentCard}>{visibleSections.map((section, index) => <View key={section.id} style={[styles.section, index < visibleSections.length - 1 && styles.sectionBorder]}><Text style={styles.sectionTitle}>{section.title}</Text><Text style={styles.sectionBody}>{section.body}</Text></View>)}</View><View style={styles.help}><AppIcon name="headset" size={19} color={nwcColors.brandNavy} /><Text style={styles.helpText}>Need help with a shipment, invoice, or account request? Use Support in the app.</Text></View></ScrollView><View style={styles.footer}><PrimaryButton label={acknowledged ? "Acknowledged" : "I understand"} icon={acknowledged ? "check" : "file-document-outline"} onPress={() => setAcknowledged(true)} /></View></View></Screen>;
}

function TopicChip({ label, selected, onPress }: { label: string; selected: boolean; onPress: () => void }) { return <TouchableOpacity accessibilityRole="button" accessibilityState={{ selected }} accessibilityLabel={`Show ${label}`} onPress={onPress} activeOpacity={0.74} style={[styles.chip, selected && styles.chipSelected]}><Text style={[styles.chipText, selected && styles.chipTextSelected]}>{label}</Text></TouchableOpacity>; }

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  header: { minHeight: 60, paddingHorizontal: 20, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerTitle: { flex: 1, textAlign: "center", color: nwcColors.brandNavy, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  headerSpacer: { width: 44, height: 44 },
  content: { paddingHorizontal: 20, paddingTop: 15, paddingBottom: 124, gap: 20 },
  lead: { gap: 7 },
  eyebrow: { color: nwcColors.info, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.9, textTransform: "uppercase" },
  title: { color: nwcColors.foreground, fontSize: 28, lineHeight: 35, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.5 },
  summary: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium" },
  contents: { gap: 7 },
  contentsLabel: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  chips: { gap: 8, paddingRight: 20 },
  chip: { minHeight: 35, justifyContent: "center", paddingHorizontal: 12, borderRadius: 13, borderWidth: 1, borderColor: "#DCE6E8", backgroundColor: nwcColors.surface },
  chipSelected: { backgroundColor: nwcColors.brandNavy, borderColor: nwcColors.brandNavy },
  chipText: { color: nwcColors.brandNavy, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold" },
  chipTextSelected: { color: nwcColors.white },
  documentCard: { borderWidth: 1, borderColor: "#E1E9EB", borderRadius: 24, backgroundColor: nwcColors.surface, paddingHorizontal: 16 },
  section: { gap: 7, paddingVertical: 17 },
  sectionBorder: { borderBottomWidth: 1, borderBottomColor: nwcColors.border },
  sectionTitle: { color: nwcColors.foreground, fontSize: 16, lineHeight: 22, fontFamily: "Poppins_800ExtraBold" },
  sectionBody: { color: nwcColors.muted, fontSize: 12, lineHeight: 19, fontFamily: "Poppins_500Medium" },
  help: { borderRadius: 18, padding: 14, flexDirection: "row", gap: 10, backgroundColor: "#EEF5F7" },
  helpText: { flex: 1, color: nwcColors.info, fontSize: 11, lineHeight: 17, fontFamily: "Poppins_600SemiBold" },
  footer: { position: "absolute", left: 0, right: 0, bottom: 0, paddingHorizontal: 20, paddingTop: 12, paddingBottom: 20, borderTopWidth: 1, borderTopColor: "#E6ECEE", backgroundColor: nwcColors.background },
});
