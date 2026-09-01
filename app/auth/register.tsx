import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";

import { AuthPasswordInput, AuthScreen, AuthTextInput } from "@/components/auth/auth-shell";
import { isValidEmailInput, isValidPhoneInput } from "@/lib/auth-flow";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Lusaka");
  const [password, setPassword] = useState("");
  const { beginRegistration } = useCustomerAuth();
  const valid = name.trim().length >= 2 && isValidEmailInput(email) && isValidPhoneInput(phone) && city.trim().length >= 2 && password.length >= 8;

  const register = () => {
    beginRegistration({ name, email, phone, city });
    router.push("/auth/verify" as Href);
  };

  return <AuthScreen showBack title="Create your account" detail="Enter your details to book deliveries, track cargo, and receive secure shipment updates." primaryLabel="Create account" onPrimary={register} primaryDisabled={!valid} secondaryLabel="I already have an account" onSecondary={() => router.replace("/auth/phone" as Href)}><AuthTextInput label="Full name" placeholder="e.g. Chanda Mwila" value={name} autoComplete="name" autoCapitalize="words" autoFocus onChangeText={setName} /><AuthTextInput label="Email address" placeholder="name@email.com" value={email} autoComplete="email" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} onChangeText={setEmail} /><AuthTextInput label="Mobile number" placeholder="097 123 4567" value={phone} autoComplete="tel" keyboardType="phone-pad" onChangeText={setPhone} maxLength={16} /><AuthTextInput label="City" placeholder="e.g. Lusaka" value={city} autoCapitalize="words" onChangeText={setCity} /><AuthPasswordInput label="Create password" placeholder="At least 8 characters" value={password} autoComplete="new-password" textContentType="newPassword" onChangeText={setPassword} /><View style={styles.terms}><Text style={styles.termsText}>By creating an account, you agree to the Terms of Service and Privacy Policy.</Text></View></AuthScreen>;
}

const styles = StyleSheet.create({
  terms: { paddingHorizontal: 4 },
  termsText: { color: nwcColors.muted, textAlign: "center", fontSize: 11, lineHeight: 17, fontFamily: "Poppins_500Medium" },
});
