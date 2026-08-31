import { useState, type PropsWithChildren } from "react";
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, type TextInputProps } from "react-native";
import { router } from "expo-router";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { IconButton, PrimaryButton, SecondaryButton, Screen } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";
import type { BookingStep } from "@/types/cargo";

const steps: { id: BookingStep; label: string }[] = [
  { id: "route", label: "Route" },
  { id: "parcel", label: "Parcel" },
  { id: "contacts", label: "Contacts" },
  { id: "schedule", label: "Schedule" },
  { id: "review", label: "Review" },
];

export function BookingScreen({ activeStep, title, detail, children, continueLabel, onContinue, continueDisabled, secondaryLabel, onSecondary }: PropsWithChildren<{ activeStep: BookingStep; title: string; detail: string; continueLabel: string; onContinue: () => void; continueDisabled?: boolean; secondaryLabel?: string; onSecondary?: () => void }>) {
  return <Screen><View style={styles.screen}><View style={styles.topBar}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={styles.topBarTitle}>Local Delivery</Text><View style={styles.topBarSpacer} /></View><ProgressSteps activeStep={activeStep} /><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}><Text style={styles.kicker}>New booking</Text><Text style={styles.bookingTitle}>{title}</Text><Text style={styles.detail}>{detail}</Text><View style={styles.content}>{children}</View></ScrollView><View style={styles.footer}>{secondaryLabel && onSecondary ? <SecondaryButton label={secondaryLabel} onPress={onSecondary} style={styles.secondaryFooterButton} /> : null}<PrimaryButton label={continueLabel} onPress={onContinue} disabled={continueDisabled} icon="arrow-right" /></View></View></Screen>;
}

export function ProgressSteps({ activeStep }: { activeStep: BookingStep }) {
  const activeIndex = steps.findIndex((step) => step.id === activeStep);
  return <View accessibilityRole="progressbar" accessibilityValue={{ min: 1, max: steps.length, now: activeIndex + 1 }} style={styles.progress}><View style={styles.progressMeta}><Text style={styles.progressLabel}>{`Step ${activeIndex + 1} of ${steps.length}`}</Text><Text style={styles.progressName}>{steps[activeIndex].label}</Text></View><View style={styles.progressTrack}>{steps.map((step, index) => <View key={step.id} style={[styles.progressSegment, index <= activeIndex && styles.progressSegmentActive]} />)}</View></View>;
}

export function FormField({ label, icon, ...props }: TextInputProps & { label: string; icon?: AppIconName }) {
  return <View style={styles.fieldWrap}><Text style={styles.fieldLabel}>{label}</Text><View style={styles.inputFrame}>{icon ? <AppIcon name={icon} size={20} color={nwcColors.muted} /> : null}<TextInput placeholderTextColor="#91A0AE" style={styles.input} {...props} /></View></View>;
}

export function ChoiceTile({ title, detail, icon, selected, onPress }: { title: string; detail: string; icon: AppIconName; selected: boolean; onPress: () => void }) {
  return <TouchableOpacity accessibilityRole="radio" accessibilityState={{ selected }} accessibilityLabel={title} accessibilityHint={detail} activeOpacity={0.78} onPress={onPress} style={[styles.choiceTile, selected && styles.choiceTileSelected]}><View style={[styles.choiceIcon, selected && styles.choiceIconSelected]}><AppIcon name={icon} size={21} color={selected ? nwcColors.primaryInk : nwcColors.brandNavy} /></View><View style={styles.choiceCopy}><Text style={styles.choiceTitle}>{title}</Text><Text style={styles.choiceDetail}>{detail}</Text></View><View style={[styles.radio, selected && styles.radioSelected]}>{selected ? <View style={styles.radioDot} /> : null}</View></TouchableOpacity>;
}

export function BookingSection({ label, children }: PropsWithChildren<{ label?: string }>) { return <View style={styles.bookingSection}>{label ? <Text style={styles.sectionLabel}>{label}</Text> : null}{children}</View>; }

export function OptionalDetails({ label = "Add details", children }: PropsWithChildren<{ label?: string }>) {
  const [open, setOpen] = useState(false);
  return <View style={styles.optionalWrap}><TouchableOpacity accessibilityRole="button" accessibilityState={{ expanded: open }} accessibilityLabel={open ? `Hide ${label.toLowerCase()}` : label} activeOpacity={0.74} onPress={() => setOpen((value) => !value)} style={styles.optionalToggle}><Text style={styles.optionalLabel}>{open ? "Hide details" : label}</Text><AppIcon name={open ? "chevron-up" : "plus"} size={19} color={nwcColors.brandNavy} /></TouchableOpacity>{open ? <View style={styles.optionalContent}>{children}</View> : null}</View>;
}

export function SummaryRow({ label, value, onEdit }: { label: string; value: string; onEdit?: () => void }) {
  return <View style={styles.summaryRow}><View style={styles.summaryCopy}><Text style={styles.summaryLabel}>{label}</Text><Text style={styles.summaryValue}>{value}</Text></View>{onEdit ? <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Edit ${label}`} onPress={onEdit} style={styles.editButton}><Text style={styles.editButtonText}>Edit</Text></TouchableOpacity> : null}</View>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: nwcColors.background },
  topBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingTop: 4, paddingBottom: 8 },
  topBarTitle: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
  topBarSpacer: { height: 44, width: 44 },
  progress: { paddingHorizontal: 20, paddingBottom: 13, gap: 7 },
  progressMeta: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  progressTrack: { flexDirection: "row", gap: 5 },
  progressSegment: { height: 3, flex: 1, borderRadius: 3, backgroundColor: "#DDE6EA" },
  progressSegmentActive: { backgroundColor: nwcColors.primary },
  progressLabel: { color: nwcColors.muted, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_700Bold" },
  progressName: { color: nwcColors.brandNavy, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 28 },
  kicker: { color: nwcColors.info, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.6, textTransform: "uppercase" },
  bookingTitle: { color: nwcColors.foreground, fontSize: 27, lineHeight: 34, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.45, marginTop: 4 },
  detail: { color: nwcColors.muted, fontSize: 14, lineHeight: 21, fontFamily: "Poppins_500Medium", marginTop: 5 },
  content: { marginTop: 22, gap: 18 },
  footer: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, borderTopWidth: 1, borderTopColor: nwcColors.border, backgroundColor: nwcColors.surface },
  secondaryFooterButton: { marginBottom: 9 },
  fieldWrap: { gap: 7 },
  fieldLabel: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_700Bold" },
  inputFrame: { minHeight: 58, borderRadius: 19, borderWidth: 1, borderColor: nwcColors.border, backgroundColor: nwcColors.surface, paddingHorizontal: 15, flexDirection: "row", alignItems: "center", gap: 10 },
  input: { color: nwcColors.foreground, flex: 1, minHeight: 54, fontSize: 16, lineHeight: 21, fontFamily: "Poppins_600SemiBold", paddingVertical: 0 },
  bookingSection: { gap: 10 },
  sectionLabel: { color: nwcColors.muted, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.5, textTransform: "uppercase", marginBottom: 2 },
  choiceTile: { minHeight: 78, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: nwcColors.border, borderRadius: 21, backgroundColor: nwcColors.surface, padding: 13 },
  choiceTileSelected: { borderColor: nwcColors.brandNavy, backgroundColor: "#F2F8FA" },
  choiceIcon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 14, backgroundColor: "#EAF1F4" },
  choiceIconSelected: { backgroundColor: nwcColors.primary },
  choiceCopy: { flex: 1, gap: 2 },
  choiceTitle: { color: nwcColors.foreground, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
  choiceDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_500Medium" },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 1.5, borderColor: nwcColors.border, alignItems: "center", justifyContent: "center" },
  radioSelected: { borderColor: nwcColors.brandNavy },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: nwcColors.brandNavy },
  summaryRow: { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: nwcColors.border, flexDirection: "row", alignItems: "center", gap: 12 },
  summaryCopy: { flex: 1, gap: 3 },
  summaryLabel: { color: nwcColors.muted, fontSize: 12, lineHeight: 16, fontWeight: "800" },
  summaryValue: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontWeight: "700" },
  editButton: { minHeight: 38, justifyContent: "center", paddingHorizontal: 6 },
  editButtonText: { color: nwcColors.info, fontSize: 13, lineHeight: 18, fontWeight: "800" },
  optionalWrap: { gap: 10 },
  optionalToggle: { minHeight: 48, paddingHorizontal: 15, borderRadius: 17, backgroundColor: "#EEF3F5", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  optionalLabel: { color: nwcColors.brandNavy, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  optionalContent: { gap: 12 },
});
