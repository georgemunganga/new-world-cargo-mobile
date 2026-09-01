import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";

import { AuthScreen, OtpInput } from "@/components/auth/auth-shell";
import { FRONTEND_OTP_CODE, isValidFrontendOtp } from "@/lib/auth-flow";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function VerifyScreen() {
  const [code, setCode] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);
  const [seconds, setSeconds] = useState(30);
  const { pendingAuth, completeVerification, clearPendingAuth } = useCustomerAuth();
  const isValid = isValidFrontendOtp(code);

  useEffect(() => {
    if (!pendingAuth) router.replace("/auth/phone" as Href);
  }, [pendingAuth]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const verify = async () => {
    setHasAttempted(true);
    if (!isValid) return;
    await completeVerification();
    router.replace("/(tabs)" as Href);
  };

  const changeDestination = () => {
    clearPendingAuth();
    router.replace(pendingAuth?.mode === "register" ? "/auth/register" : "/auth/phone");
  };

  const resend = () => {
    if (seconds > 0) return;
    setCode("");
    setHasAttempted(false);
    setSeconds(30);
  };

  const destination = pendingAuth?.destination ?? "your account";
  const channel = pendingAuth?.channel === "email" ? "email" : "mobile number";

  return <AuthScreen showBack title="Check your messages" detail={`Enter the six-digit code sent to your ${channel} ${destination}.`} primaryLabel="Verify and continue" onPrimary={verify} primaryDisabled={code.length < 6} secondaryLabel="Use a different phone or email" onSecondary={changeDestination}><OtpInput value={code} onChange={(next) => { setCode(next); setHasAttempted(false); }} /><View style={styles.resendRow}><Text style={styles.resendText}>Didn’t receive a code?</Text><TouchableOpacity accessibilityRole="button" disabled={seconds > 0} onPress={resend}><Text style={[styles.resendAction, seconds > 0 && styles.resendDisabled]}>{seconds > 0 ? `Resend in 0:${String(seconds).padStart(2, "0")}` : "Resend code"}</Text></TouchableOpacity></View>{hasAttempted && !isValid ? <Text accessibilityRole="alert" style={styles.error}>That code is incorrect. Check it and try again.</Text> : null}<View style={styles.demoCode}><Text style={styles.demoTitle}>Demo verification</Text><Text style={styles.demoDetail}>Use code {FRONTEND_OTP_CODE} while SMS and email delivery are being connected.</Text></View></AuthScreen>;
}

const styles = StyleSheet.create({
  resendRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 5 },
  resendText: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
  resendAction: { color: nwcColors.info, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  resendDisabled: { color: nwcColors.muted },
  demoCode: { borderRadius: 16, padding: 13, backgroundColor: "#FFF7E2", gap: 3 },
  demoTitle: { color: nwcColors.warning, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_800ExtraBold" },
  demoDetail: { color: nwcColors.foreground, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_600SemiBold" },
  error: { color: nwcColors.error, textAlign: "center", fontSize: 12, lineHeight: 18, fontFamily: "Poppins_700Bold" },
});
