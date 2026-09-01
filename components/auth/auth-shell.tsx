import { useRef, useState, type PropsWithChildren, type ReactNode } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, type TextInputProps } from "react-native";
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
  afterActions?: ReactNode;
}>;

export function AuthScreen({ children, title, detail, primaryLabel, onPrimary, primaryDisabled, secondaryLabel, onSecondary, showBack = false, afterActions }: AuthScreenProps) {
  return <Screen><KeyboardAvoidingView style={styles.flex} behavior={Platform.select({ ios: "padding", default: undefined })}><ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}><View style={styles.brandHeader}>{showBack ? <View style={styles.back}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /></View> : null}<Image accessibilityLabel="New WorldCargo" source={require("../../assets/images/new-world-cargo-logo.png")} resizeMode="contain" style={styles.logo} /></View><View style={styles.copy}><Text style={styles.title}>{title}</Text><Text style={styles.detail}>{detail}</Text></View><View style={styles.children}>{children}</View><View style={styles.actions}><PrimaryButton label={primaryLabel} onPress={onPrimary} disabled={primaryDisabled} />{secondaryLabel && onSecondary ? <SecondaryButton label={secondaryLabel} onPress={onSecondary} /> : null}{afterActions}</View></ScrollView></KeyboardAvoidingView></Screen>;
}

export function AuthTextInput({ label, ...inputProps }: TextInputProps & { label: string }) {
  return <View style={styles.inputGroup}><Text style={styles.inputLabel}>{label}</Text><TextInput accessibilityLabel={label} placeholderTextColor="#889AA8" style={styles.input} {...inputProps} /></View>;
}

export function AuthPasswordInput({ label = "Password", ...inputProps }: TextInputProps & { label?: string }) {
  const [visible, setVisible] = useState(false);
  return <View style={styles.inputGroup}><Text style={styles.inputLabel}>{label}</Text><View style={styles.passwordFrame}><TextInput accessibilityLabel={label} placeholderTextColor="#889AA8" secureTextEntry={!visible} autoCapitalize="none" autoCorrect={false} style={styles.passwordInput} {...inputProps} /><TouchableOpacity accessibilityRole="button" accessibilityLabel={visible ? "Hide password" : "Show password"} onPress={() => setVisible((current) => !current)} style={styles.passwordToggle}><AppIcon name={visible ? "eye-off-outline" : "eye-outline"} size={21} color={nwcColors.muted} /></TouchableOpacity></View></View>;
}

export function OtpInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const inputRef = useRef<TextInput>(null);
  const digits = Array.from({ length: 6 }, (_, index) => value[index] ?? "");
  const activeIndex = Math.min(value.length, 5);

  return <View style={styles.inputGroup}><Text style={styles.inputLabel}>Verification code</Text><Pressable accessibilityRole="button" accessibilityLabel="Enter six-digit verification code" onPress={() => inputRef.current?.focus()} style={styles.otpInput}><View style={styles.otpRow}>{digits.map((digit, index) => <View key={index} style={[styles.otpBox, index === activeIndex && styles.otpBoxActive, Boolean(digit) && styles.otpBoxFilled]}><Text style={styles.otpDigit}>{digit}</Text></View>)}</View><TextInput ref={inputRef} value={value} onChangeText={(next) => onChange(next.replace(/\D/g, "").slice(0, 6))} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="one-time-code" autoFocus maxLength={6} caretHidden style={styles.otpHiddenInput} /></Pressable></View>;
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 30, paddingBottom: 30, gap: 24 },
  brandHeader: { minHeight: 96, alignItems: "center", justifyContent: "center" },
  back: { position: "absolute", left: 0, top: 0 },
  logo: { width: 190, height: 76 },
  copy: { gap: 6, alignItems: "center" },
  title: { color: nwcColors.foreground, textAlign: "center", fontSize: 29, lineHeight: 37, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.5 },
  detail: { color: nwcColors.muted, textAlign: "center", fontSize: 14, lineHeight: 21, fontFamily: "Poppins_500Medium" },
  children: { gap: 15 },
  actions: { marginTop: "auto", gap: 10 },
  inputGroup: { gap: 7 },
  inputLabel: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_700Bold" },
  input: { minHeight: 56, borderWidth: 1, borderColor: nwcColors.border, borderRadius: 16, color: nwcColors.foreground, backgroundColor: nwcColors.white, fontSize: 17, lineHeight: 22, fontFamily: "Poppins_600SemiBold", paddingHorizontal: 16 },
  passwordFrame: { minHeight: 56, flexDirection: "row", alignItems: "center", borderWidth: 1, borderColor: nwcColors.border, borderRadius: 16, backgroundColor: nwcColors.white },
  passwordInput: { flex: 1, minHeight: 54, color: nwcColors.foreground, fontSize: 17, lineHeight: 22, fontFamily: "Poppins_600SemiBold", paddingLeft: 16 },
  passwordToggle: { width: 52, height: 54, alignItems: "center", justifyContent: "center" },
  otpInput: { position: "relative" },
  otpRow: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  otpBox: { flex: 1, aspectRatio: 0.82, maxHeight: 64, borderRadius: 16, borderWidth: 1.5, borderColor: nwcColors.border, backgroundColor: nwcColors.white, alignItems: "center", justifyContent: "center" },
  otpBoxActive: { borderColor: nwcColors.brandNavy, borderWidth: 2 },
  otpBoxFilled: { backgroundColor: "#FFF9E8", borderColor: nwcColors.primary },
  otpDigit: { color: nwcColors.foreground, fontSize: 24, lineHeight: 30, fontFamily: "Poppins_800ExtraBold" },
  otpHiddenInput: { ...StyleSheet.absoluteFillObject, opacity: 0.01, color: "transparent" },
});
