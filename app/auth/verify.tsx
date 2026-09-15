import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";

import { AuthScreen, OtpInput } from "@/components/auth/auth-shell";
import { useAppToast } from "@/components/ui/app-toast";
import { isValidFrontendOtp } from "@/lib/auth-flow";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function VerifyScreen() {
  const [code, setCode] = useState("");
  const [seconds, setSeconds] = useState(30);
  const { pendingAuth, authChallenge, authError, completeVerification, clearPendingAuth, resendVerification } = useCustomerAuth();
  const toast = useAppToast();
  const isValid = isValidFrontendOtp(code);

  useEffect(() => {
    if (authError) toast.error(authError);
  }, [authError, toast]);

  useEffect(() => {
    if (!pendingAuth) router.replace("/auth/phone" as Href);
  }, [pendingAuth]);

  useEffect(() => {
    if (seconds <= 0) return;
    const timer = setTimeout(() => setSeconds((current) => current - 1), 1000);
    return () => clearTimeout(timer);
  }, [seconds]);

  const verify = async () => {
    if (!isValid) {
      toast.error("Enter the six-digit code from your message.");
      return;
    }
    const completedRegistration = pendingAuth?.mode === "register";
    const verified = await completeVerification(code);
    if (verified) {
      if (completedRegistration) toast.success("Account verified. Welcome to New WorldCargo.");
      router.dismissAll();
      router.replace("/(tabs)" as Href);
    }
  };

  const changeDestination = () => {
    clearPendingAuth();
    router.replace(pendingAuth?.mode === "register" ? "/auth/register" : "/auth/phone");
  };

  const resend = async () => {
    if (seconds > 0) return;
    setCode("");
    const sent = await resendVerification();
    if (sent) {
      setSeconds(authChallenge?.resendAfterSeconds ?? 30);
      toast.success("Verification code sent.");
    }
  };

  const destination = authChallenge?.destination ?? pendingAuth?.destination ?? "your account";
  const channel = (authChallenge?.channel ?? pendingAuth?.channel) === "email" ? "email" : "mobile number";

  return <AuthScreen showBack title="Check your messages" detail={`Enter the six-digit code sent to your ${channel} ${destination}.`} primaryLabel="Verify and continue" onPrimary={verify} primaryDisabled={code.length < 6} secondaryLabel="Use a different phone or email" onSecondary={changeDestination}><OtpInput value={code} onChange={setCode} /><View style={styles.resendRow}><Text style={styles.resendText}>Didn’t receive a code?</Text><TouchableOpacity accessibilityRole="button" disabled={seconds > 0} onPress={resend}><Text style={[styles.resendAction, seconds > 0 && styles.resendDisabled]}>{seconds > 0 ? `Resend in 0:${String(seconds).padStart(2, "0")}` : "Resend code"}</Text></TouchableOpacity></View><View style={styles.helpCard}><Text style={styles.helpTitle}>Security check</Text><Text style={styles.helpDetail}>This confirms the contact on your customer account before opening shipment and payment details.</Text></View></AuthScreen>;
}

const styles = StyleSheet.create({
  resendRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", gap: 5 },
  resendText: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
  resendAction: { color: nwcColors.info, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  resendDisabled: { color: nwcColors.muted },
  helpCard: { borderRadius: 16, padding: 13, backgroundColor: "#FFF7E2", gap: 3 },
  helpTitle: { color: nwcColors.warning, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_800ExtraBold" },
  helpDetail: { color: nwcColors.foreground, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_600SemiBold" },
});
