import type { PropsWithChildren } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View, type TextInputProps } from "react-native";
import { router } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton, PrimaryButton, SecondaryButton, Screen } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

type AuthScreenProps = PropsWithChildren<{
  title: string;
  detail: string;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  secondaryLabel?: string;
  onSecondary?: () => void;
  showBack?: boolean;
}>;

export function AuthScreen({ children, title, detail, primaryLabel, onPrimary, primaryDisabled, secondaryLabel, onSecondary, showBack = false }: AuthScreenProps) {
  return <Screen><KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: "padding", default: undefined })}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}><View style={styles.top}>{showBack ? <IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /> : <View style={styles.mark}><AppIcon name="arrow-top-right" size={24} color={nwcColors.primaryInk} /></View>}<View style={styles.brand}><Text style={styles.brandText}>New WorldCargo</Text><Text style={styles.brandSubtext}>Customer access</Text></View></View><View style={styles.copy}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View><View style={styles.children}>{children}</View><View style={styles.actions}><PrimaryButton label={primaryLabel} onPress={onPrimary} disabled={primaryDisabled} />{secondaryLabel && onSecondary ? <SecondaryButton label={secondaryLabel} onPress={onSecondary} /> : null}</View></ScrollView></KeyboardAvoidingView></Screen>;
}

export function AuthTextInput({ label, ...inputProps }: TextInputProps & { label: string }) {
  return <View style={styles.inputGroup}><Text style={styles.inputLabel}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor="#889AA8" style={styles.input} {...inputProps} /></View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 36, gap: 28 },
  top: { flexDirection: "row", alignItems: "center", gap: 12 },
  mark: { width: 44, height: 44, borderRadius: 16, backgroundColor: nwcColors.primary, alignItems: "center", justifyContent: "center" },
  brand: { gap: 1 },
  brandText: { color: nwcColors.brandNavy, fontSize: 17, lineHeight: 22, fontFamily: "Poppins_800ExtraBold" },
  brandSubtext: { color: nwcColors.muted, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_600SemiBold" },
  copy: { gap: 8 },
  title: { color: nwcColors.foreground, fontSize: 30, lineHeight: 38, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.5 },
  detail: { color: nwcColors.muted, fontSize: 15, lineHeight: 23, fontFamily: "Poppins_500Medium" },
  children: { gap: 15 },
  actions: { marginTop: "auto", gap: 10 },
  inputGroup: { gap: 7 },
  inputLabel: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_700Bold" },
  input: { minHeight: 56, borderWidth: 1, borderColor: nwcColors.border, borderRadius: 16, color: nwcColors.foreground, backgroundColor: nwcColors.white, fontSize: 17, lineHeight: 22, fontFamily: "Poppins_600SemiBold", paddingHorizontal: 16 },
});
