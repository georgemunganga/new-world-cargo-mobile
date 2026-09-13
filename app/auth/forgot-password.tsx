import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";

import { AuthPasswordInput, AuthScreen, AuthTextInput, OtpInput } from "@/components/auth/auth-shell";
import { isValidAuthIdentifier } from "@/lib/auth-flow";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function ForgotPasswordScreen() {
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [changed, setChanged] = useState(false);
  const { authError, requestPasswordReset, resetPassword } = useCustomerAuth();
  const requestReset = async () => {
    const started = await requestPasswordReset(identifier);
    if (started) setSent(true);
  };
  const submitNewPassword = async () => {
    const saved = await resetPassword(code, password);
    if (saved) setChanged(true);
  };
  if (changed) return <AuthScreen showBack title="Password changed" detail="Your New WorldCargo password has been updated. Sign in with the new password to continue." primaryLabel="Back to sign in" onPrimary={() => router.replace("/auth/phone" as Href)}><View style={styles.notice}><Text style={styles.noticeTitle}>All set</Text><Text style={styles.noticeDetail}>Use your new password the next time you open the app.</Text></View></AuthScreen>;
  return <AuthScreen showBack title="Reset your password" detail={sent ? "Enter the verification code and choose a new password." : "Enter the email address or phone number connected to your account."} primaryLabel={sent ? "Save new password" : "Send recovery code"} onPrimary={sent ? submitNewPassword : requestReset} primaryDisabled={sent ? code.length < 6 || password.length < 8 : !isValidAuthIdentifier(identifier)} secondaryLabel="Back to sign in" onSecondary={() => router.replace("/auth/phone" as Href)}><AuthTextInput label="Email address or phone" placeholder="name@email.com or +260 97 123 4567" value={identifier} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoFocus={!sent} editable={!sent} onChangeText={setIdentifier} />{sent ? <><OtpInput value={code} onChange={setCode} /><AuthPasswordInput label="New password" placeholder="At least 8 characters" value={password} autoComplete="new-password" textContentType="newPassword" onChangeText={setPassword} /><View style={styles.notice}><Text style={styles.noticeTitle}>Check your messages</Text><Text style={styles.noticeDetail}>If an account matches those details, the reset code is ready for this app flow.</Text></View></> : null}{authError ? <Text accessibilityRole="alert" style={styles.errorText}>{authError}</Text> : null}</AuthScreen>;
}

const styles = StyleSheet.create({
  notice: { padding: 14, gap: 3, borderRadius: 16, backgroundColor: "#E5F4EE" },
  noticeTitle: { color: nwcColors.success, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" },
  noticeDetail: { color: nwcColors.foreground, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
  errorText: { color: nwcColors.error, textAlign: "center", fontSize: 12, lineHeight: 18, fontFamily: "Poppins_700Bold" },
});
