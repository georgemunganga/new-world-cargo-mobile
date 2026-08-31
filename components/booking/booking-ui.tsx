import type { PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, type TextInputProps } from "react-native";
import { router } from "expo-router";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { IconButton, PrimaryButton, SecondaryButton, Screen, SectionHeader } from "@/components/ui/nwc-ui";
import { nwcColors, nwcRadii } from "@/lib/nwc-theme";
import type { BookingStep } from "@/types/cargo";

const steps: { id: BookingStep; label: string }[] = [
  { id: "route", label: "Route" },
  { id: "parcel", label: "Parcel" },
  { id: "contacts", label: "Contacts" },
  { id: "schedule", label: "Schedule" },
  { id: "review", label: "Review" },
];

export function BookingScreen({ activeStep, title, detail, children, continueLabel, onContinue, continueDisabled, secondaryLabel, onSecondary }: PropsWithChildren<{ activeStep: BookingStep; title: string; detail: string; continueLabel: string; onContinue: () => void; continueDisabled?: boolean; secondaryLabel?: string; onSecondary?: () => void }>) {
  return <Screen><View style={styles.screen}><View style={styles.topBar}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={styles.topBarTitle}>Local Delivery</Text><View style={styles.topBarSpacer} /></View><ProgressSteps activeStep={activeStep} /><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}><SectionHeader eyebrow="New booking" title={title} /><Text style={styles.detail}>{detail}</Text><View style={styles.content}>{children}</View></ScrollView><View style={styles.footer}>{secondaryLabel && onSecondary ? <SecondaryButton label={secondaryLabel} onPress={onSecondary} style={styles.secondaryFooterButton} /> : null}<PrimaryButton label={continueLabel} onPress={onContinue} disabled={continueDisabled} icon="arrow-right" /></View></View></Screen>;
}

export function ProgressSteps({ activeStep }: { activeStep: BookingStep }) {
  const activeIndex = steps.findIndex((step) => step.id === activeStep);
  return <View accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: steps.length, now: activeIndex + 1 }} style={styles.progress}><View style={styles.progressTrack}>{steps.map((step, index) => <View key={step.id} style={[styles.progressSegment, index <= activeIndex && styles.progressSegmentActive]} />)}</View><Text style={styles.progressLabel}>{`Step ${activeIndex + 1} of ${steps.length} · ${steps[activeIndex].label}`}</Text></View>;
}

export function FormField({ label, icon, ...props }: TextInputProps & { label: string; icon?: AppIconName }) {
  return <View style={styles.fieldWrap}><Text style={styles.fieldLabel}>{label}</Text><View style={styles.inputFrame}>{icon ? <AppIcon name={icon} size={20} color={nwcColors.muted} /> : null}<TextInput placeholderTextColor="#91A0AE" style={styles.input} {...props} /></View></View>;
}

export function ChoiceTile({ title, detail, icon, selected, onPress }: { title: string; detail: string; icon: AppIconName; selected: boolean; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={title} accessibilityHint={detail} activeOpacity={0.78} onPress={onPress} style={[styles.choiceTile, selected && styles.choiceTileSelected]}><View style={[styles.choiceIcon, selected && styles.choiceIconSelected]}><AppIcon name={icon} size={21} color={selected ? nwcColors.primaryInk : nwcColors.brandNavy} /></View><View style={styles.choiceCopy}><Text style={styles.choiceTitle}>{title}</Text><Text style={styles.choiceDetail}>{detail}</Text></View><View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <View style={styles.radioDot} /> : null}</View></TouchableOpacity>;
}

export function BookingSection({ label, children }: PropsWithChildren<{ label?: string }>) { return <View style={styles.bookingSection}>{label ? <Text style={styles.sectionLabel}>{label}</Text> : null}{children}</View>; }

export function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return <View style={styles.summaryRow}><View style={styles.summaryCopy}><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue}>{value}</Text></View>{onEdit ? <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Edit ${label}`} onPress={onEdit} style={styles.editButton}><Text style={styles.editButtonText}>Edit</Text></TouchableOpacity> : null}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nwcColors.background },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingTop: 4, paddingBottom: 10 },
  topBarTitle: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 20, fontWeight: "800" },
  topBarSpacer: { height: 44, width: 44 },
  progress: { paddingHorizontal: 20, paddingBottom: 14 },
  progressTrack: { flexDirection: "row", gap: 4 },
  progressSegment: { height: 4, flex: 1, borderRadius: 4, backgroundColor: "#DDE6EA" },
  progressSegmentActive: { backgroundColor: nwcColors.primary },
  progressLabel: { marginTop: 8, color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontWeight: "700" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 },
  detail: { color: nwcColors.muted, fontSize: 15, lineHeight: 22, fontWeight: "500", marginTop: -3 },
  content: { marginTop: 24, gap: 18 },
  footer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: nwcColors.border, backgroundColor: nwcColors.surface },
  secondaryFooterButton: { marginBottom: 9 },
  fieldWrap: { gap: 8 },
  fieldLabel: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontWeight: "800" },
  inputFrame: { minHeight: 54, borderRadius: nwcRadii.control, borderWidth: 1, borderColor: nwcColors.border, backgroundColor: nwcColors.surface, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  input: { color: nwcColors.foreground, flex: 1, minHeight: 50, fontSize: 15, lineHeight: 20, fontWeight: "600", paddingVertical: 0 },
  bookingSection: { gap: 10 },
  sectionLabel: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 2 },
  choiceTile: { minHeight: 78, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: nwcColors.border, borderRadius: 18, backgroundColor: nwcColors.surface, padding: 13 },
  choiceTileSelected: { borderColor: nwcColors.brandNavy, backgroundColor: "#F2F8FA" },
  choiceIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#EAF1F4" },
  choiceIconSelected: { backgroundColor: nwcColors.primary },
  choiceCopy: { flex: 1, gap: 2 },
  choiceTitle: { color: nwcColors.foreground, fontSize: 15, lineHeight: 20, fontWeight: "800" },
  choiceDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontWeight: "500" },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: nwcColors.border, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: nwcColors.brandNavy },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: nwcColors.brandNavy },
  summaryRow: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: nwcColors.border, flexDirection: "row", alignItems: "center", gap: 12 },
  summaryCopy: { flex: 1, gap: 3 },
  summaryLabel: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontWeight: "800" },
  summaryValue: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontWeight: "700" },
  editButton: { minHeight: 38, justifyContent: "center", paddingHorizontal: 6 },
  editButtonText: { color: nwcColors.info, fontSize: 13, lineHeight: 18, fontWeight: "800" },
});
