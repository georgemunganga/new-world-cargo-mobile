import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { useState } from "react";
import { AuthScreen, AuthTextInput } from "@/components/auth/auth-shell";
import { isValidPhoneInput, normaliseZambianPhone } from "@/lib/auth-flow";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function PhoneScreen() {
  const [phone, setPhone] = useState("");
  const { beginPhoneVerification } = useCustomerAuth();
  const valid = isValidPhoneInput(phone);
  const continueToOtp = () => { beginPhoneVerification(phone); router.push("/auth/verify" as Href); };
  return <AuthScreen showBack title="What is your phone number?" detail="We will use it to verify your account and keep you updated about your Katundu." primaryLabel="Send verification code" onPrimary={continueToOtp} primaryDisabled={!valid} secondaryLabel="Back" onSecondary={() => router.back()}><AuthTextInput label="Mobile number" placeholder="97 123 4567" value={phone} keyboardType="phone-pad" autoComplete="tel" autoFocus onChangeText={setPhone} maxLength={12} /><View style={styles.preview}><Text style={styles.previewLabel}>Number to verify</Text><Text style={styles.previewPhone}>{valid ? normaliseZambianPhone(phone) : "+260 …"}</Text></View></AuthScreen>;
}

const styles = StyleSheet.create({
  preview: { borderRadius: 16, padding: 14, backgroundColor: "#EAF4F8", gap: 3 },
  previewLabel: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold" },
  previewPhone: { color: nwcColors.foreground, fontSize: 16, lineHeight: 22, fontFamily: "Poppins_700Bold" },
});
