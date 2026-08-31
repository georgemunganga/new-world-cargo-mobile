import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { useState } from "react";
import { AuthScreen, AuthTextInput } from "@/components/auth/auth-shell";
import { FRONTEND_OTP_CODE, isValidFrontendOtp } from "@/lib/auth-flow";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function VerifyScreen() {
  const [code, setCode] = useState("");
  const [hasAttempted, setHasAttempted] = useState(false);
  const { pendingPhone } = useCustomerAuth();
  const isValid = isValidFrontendOtp(code);
  const continueToProfile = () => { setHasAttempted(true); if (isValid) router.replace("/auth/profile" as Href); };
  return <AuthScreen showBack title="Enter the verification code" detail={`Enter the six-digit code sent to ${pendingPhone || "your phone"}.`} primaryLabel="Verify phone" onPrimary={continueToProfile} primaryDisabled={code.length < 6} secondaryLabel="Change phone number" onSecondary={() => router.back()}><AuthTextInput label="6-digit code" placeholder="123456" value={code} keyboardType="number-pad" textContentType="oneTimeCode" autoComplete="one-time-code" autoFocus maxLength={6} onChangeText={setCode} /><View style={styles.demoCode}><Text style={styles.demoTitle}>Frontend preview code</Text><Text style={styles.demoDetail}>{`Use ${FRONTEND_OTP_CODE} to continue. SMS delivery will replace this preview code when authentication is connected.`}</Text></View>{hasAttempted && !isValid ? <Text style={styles.error}>That code is not valid for this preview. Try again.</Text> : null}</AuthScreen>;
}

const styles = StyleSheet.create({
  demoCode: { borderRadius: 16, padding: 14, backgroundColor: "#FBF0D8", gap: 3 },
  demoTitle: { color: nwcColors.warning, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold" },
  demoDetail: { color: nwcColors.foreground, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_600SemiBold" },
  error: { color: nwcColors.error, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_700Bold" },
});
