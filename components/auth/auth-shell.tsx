import type { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { Image } from "expo-image";
import { IconButton, PrimaryButton, Screen, SecondaryButton } from "@/components/ui/nwc-ui";
import { nwcColors, nwcRadii } from "@/lib/nwc-theme";

export function AuthScreen({ title, detail, children, primaryLabel, onPrimary, primaryDisabled, secondaryLabel, onSecondary, showBack = false }: PropsWithChildren<{ title: string; detail: string; primaryLabel: string; onPrimary: () => void; primaryDisabled?: boolean; secondaryLabel?: string; onSecondary?: () => void; showBack?: boolean }>) {
  return <Screen><KeyboardAvoidingView style={styles.keyboard} behavior={Platform.select({ ios: "padding", default: undefined })}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}><View style={styles.top}>{showBack ? <IconButton label="Go back" icon="arrow-left" onPress={onSecondary ?? (() => undefined)} /> : <View style={styles.backSpacer} />}<Image source={require("../../assets/images/new-world-cargo-logo.png")} contentFit="contain" accessibilityLabel="New WorldCargo" style={styles.logo} /></View><View style={styles.intro}><Text style={styles.eyebrow}>New WorldCargo</Text><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View><View style={styles.children}>{children}</View><View style={styles.actions}><PrimaryButton label={primaryLabel} icon="arrow-right" onPress={onPrimary} disabled={primaryDisabled} />{secondaryLabel && onSecondary ? <SecondaryButton label={secondaryLabel} onPress={onSecondary} /> : null}</View></ScrollView></KeyboardAvoidingView></Screen>;
}

export function AuthTextInput({ label, ...props }: TextInputProps & { label: string }) {
  return <View style={styles.field}><Text style={styles.fieldLabel}>{label}</Text><TextInput placeholderTextColor="#91A0AE" style={styles.input} {...props} /></View>;
}

const styles = StyleSheet.create({
  keyboard: { flex: 1 },
  content: { minHeight: "100%", paddingHorizontal: 24, paddingTop: 18, paddingBottom: 28 },
  top: { minHeight: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  logo: { width: 151, height: 60, marginRight: -3 },
  backSpacer: { width: 44, height: 44 },
  intro: { marginTop: 38, gap: 9 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.8, textTransform: "uppercase" },
  title: { color: nwcColors.foreground, fontSize: 31, lineHeight: 39, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.5 },
  detail: { color: nwcColors.muted, fontSize: 15, lineHeight: 22, fontFamily: "Poppins_500Medium", maxWidth: 350 },
  children: { marginTop: 34, gap: 16 },
  actions: { marginTop: "auto", paddingTop: 36, gap: 10 },
  field: { gap: 8 },
  fieldLabel: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  input: { minHeight: 55, borderRadius: nwcRadii.control, borderWidth: 1, borderColor: nwcColors.border, backgroundColor: nwcColors.surface, color: nwcColors.foreground, fontSize: 16, lineHeight: 21, fontFamily: "Poppins_600SemiBold", paddingHorizontal: 15 },
});
