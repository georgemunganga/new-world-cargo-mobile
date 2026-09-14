import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";

import {
  AuthPasswordInput,
  AuthScreen,
  AuthTextInput,
} from "@/components/auth/auth-shell";
import { isValidEmailInput } from "@/lib/auth-flow";
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
    const saved = await resetPassword(code.trim(), password);
    if (saved) setChanged(true);
  };
  if (changed)
    return (
      <AuthScreen
        showBack
        title="Password changed"
        detail="Your New WorldCargo password has been updated. Sign in with the new password to continue."
        primaryLabel="Back to sign in"
        onPrimary={() => router.replace("/auth/phone" as Href)}
      >
        <View style={styles.notice}>
          <Text style={styles.noticeTitle}>All set</Text>
          <Text style={styles.noticeDetail}>
            Use your new password the next time you open the app.
          </Text>
        </View>
      </AuthScreen>
    );
  return (
    <AuthScreen
      showBack
      title="Reset your password"
      detail={
        sent
          ? "Enter the six-digit OTP sent to your verified contact, then choose a new password."
          : "Enter the email address connected to your customer account."
      }
      primaryLabel={
        sent ? "Verify OTP and save password" : "Send verification code"
      }
      onPrimary={sent ? submitNewPassword : requestReset}
      primaryDisabled={
        sent
          ? !/^\d{6}$/.test(code.trim()) || password.length < 8
          : !isValidEmailInput(identifier)
      }
      secondaryLabel="Back to sign in"
      onSecondary={() => router.replace("/auth/phone" as Href)}
    >
      <AuthTextInput
        label="Email address"
        placeholder="name@email.com"
        value={identifier}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
        autoFocus={!sent}
        editable={!sent}
        onChangeText={setIdentifier}
      />
      {sent ? (
        <>
          <AuthTextInput
            label="Verification code"
            placeholder="6-digit OTP"
            value={code}
            keyboardType="number-pad"
            maxLength={6}
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={(value) => setCode(value.replace(/\D/g, ""))}
          />
          <AuthPasswordInput
            label="New password"
            placeholder="At least 8 characters"
            value={password}
            autoComplete="new-password"
            textContentType="newPassword"
            onChangeText={setPassword}
          />
          <View style={styles.notice}>
            <Text style={styles.noticeTitle}>Check your messages</Text>
            <Text style={styles.noticeDetail}>
              The one-time code expires after 10 minutes and can only be used
              once.
            </Text>
          </View>
          <Text
            accessibilityRole="button"
            onPress={requestReset}
            style={styles.resend}
          >
            Resend verification code
          </Text>
        </>
      ) : null}
      {authError ? (
        <Text accessibilityRole="alert" style={styles.errorText}>
          {authError}
        </Text>
      ) : null}
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  notice: { padding: 14, gap: 3, borderRadius: 16, backgroundColor: "#E5F4EE" },
  noticeTitle: {
    color: nwcColors.success,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "Poppins_800ExtraBold",
  },
  noticeDetail: {
    color: nwcColors.foreground,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins_500Medium",
  },
  errorText: {
    color: nwcColors.error,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins_700Bold",
  },
  resend: {
    color: nwcColors.info,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins_800ExtraBold",
    paddingVertical: 8,
  },
});
