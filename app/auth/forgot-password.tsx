import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";

import { AuthPasswordInput, AuthScreen, AuthTextInput } from "@/components/auth/auth-shell";
import { isValidEmailInput } from "@/lib/auth-flow";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function ForgotPasswordScreen() {
  const [identifier, setIdentifier] = useState("");
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [changed, setChanged] = useState(false);
  const { authError, requestPasswordReset, resetPassword } = useCustomerAuth();
  const requestReset = async () => {
    const started = await requestPasswordReset(identifier);
    if (started) setSent(true);
  };
  const submitNewPassword = async () => {
    const saved = await resetPassword(token.trim(), password);
    if (saved) setChanged(true);
  };
  if (changed) return <AuthScreen showBack title="Password changed" detail="Your New WorldCargo password has been updated. Sign in with the new password to continue." primaryLabel="Back to sign in" onPrimary={() => router.replace("/auth/phone" as Href)}><View style={styles.notice}><Text style={styles.noticeTitle}>All set</Text><Text style={styles.noticeDetail}>Use your new password the next time you open the app.</Text></View></AuthScreen>;
  return <AuthScreen showBack title="Reset your password" detail={sent ? "Paste the reset token from your email and choose a new password." : "Enter the email address connected to your customer account."} primaryLabel={sent ? "Save new password" : "Email me a reset link"} onPrimary={sent ? submitNewPassword : requestReset} primaryDisabled={sent ? token.trim().length < 8 || password.length < 8 : !isValidEmailInput(identifier)} secondaryLabel="Back to sign in" onSecondary={() => router.replace("/auth/phone" as Href)}><AuthTextInput label="Email address" placeholder="name@email.com" value={identifier} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoFocus={!sent} editable={!sent} onChangeText={setIdentifier} />{sent ? <><AuthTextInput label="Reset token" placeholder="Paste the token from your email" value={token} autoCapitalize="none" autoCorrect={false} onChangeText={setToken} /><AuthPasswordInput label="New password" placeholder="At least 8 characters" value={password} autoComplete="new-password" textContentType="newPassword" onChangeText={setPassword} /><View style={styles.notice}><Text style={styles.noticeTitle}>Check your email</Text><Text style={styles.noticeDetail}>For now, Laravel sends a password reset token by email. Paste that token here to set a new password.</Text></View></> : null}{authError ? <Text accessibilityRole="alert" style={styles.errorText}>{authError}</Text> : null}</AuthScreen>;
}

const styles = StyleSheet.create({
  notice: { padding: 14, gap: 3, borderRadius: 16, backgroundColor: "#E5F4EE" },
  noticeTitle: { color: nwcColors.success, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" },
  noticeDetail: { color: nwcColors.foreground, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
  errorText: { color: nwcColors.error, textAlign: "center", fontSize: 12, lineHeight: 18, fontFamily: "Poppins_700Bold" },
});
