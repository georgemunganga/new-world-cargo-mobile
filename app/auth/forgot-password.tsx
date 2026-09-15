import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { router, type Href } from "expo-router";

import {
  AuthPasswordInput,
  AuthScreen,
  AuthTextInput,
  OtpInput,
} from "@/components/auth/auth-shell";
import { AppNotice } from "@/components/ui/nwc-ui";
import { useAppToast } from "@/components/ui/app-toast";
import { isValidEmailInput } from "@/lib/auth-flow";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";

const DEFAULT_RESEND_SECONDS = 60;

export default function ForgotPasswordScreen() {
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [sent, setSent] = useState(false);
  const [changed, setChanged] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const { authChallenge, authError, requestPasswordReset, resetPassword } = useCustomerAuth();
  const toast = useAppToast();

  useEffect(() => {
    if (!sent || seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((current) => Math.max(0, current - 1)), 1000);
    return () => clearTimeout(timer);
  }, [seconds, sent]);

  useEffect(() => {
    if (authError) toast.error(authError);
  }, [authError, toast]);

  const requestReset = async () => {
    const started = await requestPasswordReset(identifier);
    if (started) {
      setCode("");
      setPassword("");
      setSent(true);
      setSeconds(authChallenge?.resendAfterSeconds ?? DEFAULT_RESEND_SECONDS);
      toast.success("Verification code sent.");
    }
  };
  const submitNewPassword = async () => {
    const saved = await resetPassword(code.trim(), password);
    if (saved) {
      toast.success("Password changed. Sign in with your new password.");
      setChanged(true);
    }
  };
  const resend = async () => {
    if (seconds > 0) return;
    await requestReset();
  };
  const resendDelay = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  const resendLabel = seconds > 0 ? `Resend code in ${resendDelay}` : "Resend code";
  if (changed)
    return (
      <AuthScreen
        showBack
        primaryLabel="Back to sign in"
        onPrimary={() => router.replace("/auth/phone" as Href)}
      >
        <AppNotice tone="success" message="Password changed. Sign in with your new password." />
      </AuthScreen>
    );
  return (
    <AuthScreen
      showBack
      title={sent ? undefined : "Reset your password"}
      detail={sent ? undefined : "Enter the email address connected to your customer account."}
      primaryLabel={
        sent ? "Save new password" : "Send verification code"
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
      {!sent ? (
        <AuthTextInput
          label="Email address"
          placeholder="name@email.com"
          value={identifier}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          autoFocus
          onChangeText={setIdentifier}
        />
      ) : null}
      {sent ? (
        <>
          <OtpInput value={code} onChange={setCode} />
          <AuthPasswordInput
            label="New password"
            placeholder="At least 8 characters"
            value={password}
            autoComplete="new-password"
            textContentType="newPassword"
            onChangeText={setPassword}
          />
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={{ disabled: seconds > 0 }}
            disabled={seconds > 0}
            onPress={resend}
            style={styles.resendButton}
          >
            <Text style={[styles.resend, seconds > 0 && styles.resendDisabled]}>{resendLabel}</Text>
          </TouchableOpacity>
        </>
      ) : null}
    </AuthScreen>
  );
}

const styles = StyleSheet.create({
  resendButton: { alignItems: "center", paddingVertical: 8 },
  resend: {
    color: nwcColors.info,
    textAlign: "center",
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins_800ExtraBold",
  },
  resendDisabled: { color: nwcColors.muted },
});
