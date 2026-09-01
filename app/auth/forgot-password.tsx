import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";

import { AuthScreen, AuthTextInput } from "@/components/auth/auth-shell";
import { isValidAuthIdentifier } from "@/lib/auth-flow";
import { nwcColors } from "@/lib/nwc-theme";

export default function ForgotPasswordScreen() {
  const [identifier, setIdentifier] = useState("");
  const [sent, setSent] = useState(false);
  return <AuthScreen showBack title="Reset your password" detail="Enter the email address or phone number connected to your account." primaryLabel={sent ? "Recovery link sent" : "Send recovery link"} onPrimary={() => setSent(true)} primaryDisabled={!isValidAuthIdentifier(identifier) || sent} secondaryLabel="Back to sign in" onSecondary={() => router.replace("/auth/phone" as Href)}><AuthTextInput label="Email address or phone" placeholder="name@email.com or +260 97 123 4567" value={identifier} autoCapitalize="none" autoCorrect={false} keyboardType="email-address" autoFocus onChangeText={setIdentifier} />{sent ? <View style={styles.notice}><Text style={styles.noticeTitle}>Check your messages</Text><Text style={styles.noticeDetail}>If an account matches those details, recovery instructions are on the way.</Text></View> : null}</AuthScreen>;
}

const styles = StyleSheet.create({
  notice: { padding: 14, gap: 3, borderRadius: 16, backgroundColor: "#E5F4EE" },
  noticeTitle: { color: nwcColors.success, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" },
  noticeDetail: { color: nwcColors.foreground, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
});
