import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";

import { AuthPasswordInput, AuthScreen, AuthTextInput } from "@/components/auth/auth-shell";
import { useAppToast } from "@/components/ui/app-toast";
import { isValidEmailInput, isValidPhoneInput } from "@/lib/auth-flow";
import { nwcColors } from "@/lib/nwc-theme";
import { clearRegistrationDraft, readRegistrationDraft, writeRegistrationDraft } from "@/lib/storage/registration-draft-storage";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Lusaka");
  const [password, setPassword] = useState("");
  const [draftRestored, setDraftRestored] = useState(false);
  const { authError, beginRegistration, clearRegistrationError, registrationErrors } = useCustomerAuth();
  const toast = useAppToast();
  const valid = name.trim().length >= 2 && isValidEmailInput(email) && isValidPhoneInput(phone) && city.trim().length >= 2 && password.length >= 8;

  useEffect(() => {
    if (authError) toast.error(authError);
  }, [authError, toast]);

  useEffect(() => {
    let active = true;
    void readRegistrationDraft()
      .then((draft) => {
        if (!active || !draft) return;
        setName(draft.name);
        setEmail(draft.email);
        setPhone(draft.phone);
        setCity(draft.city || "Lusaka");
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setDraftRestored(true);
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!draftRestored) return;
    const timer = setTimeout(() => {
      void writeRegistrationDraft({ name, email, phone, city });
    }, 250);
    return () => clearTimeout(timer);
  }, [city, draftRestored, email, name, phone]);

  const register = async () => {
    const started = await beginRegistration({ name, email, phone, city, password });
    if (started) {
      setDraftRestored(false);
      await clearRegistrationDraft();
      router.push("/auth/verify" as Href);
    }
  };

  return <AuthScreen showBack title="Create your account" detail="Enter your details to book deliveries, track cargo, and receive secure shipment updates." primaryLabel="Create account" onPrimary={register} primaryDisabled={!draftRestored || !valid} secondaryLabel="I already have an account" onSecondary={() => router.replace("/auth/phone" as Href)}><AuthTextInput label="Full name" placeholder="e.g. Chanda Mwila" value={name} error={registrationErrors.name} autoComplete="name" autoCapitalize="words" autoFocus onChangeText={(value) => { setName(value); clearRegistrationError("name"); }} /><AuthTextInput label="Email address" placeholder="name@email.com" value={email} error={registrationErrors.email} autoComplete="email" keyboardType="email-address" autoCapitalize="none" autoCorrect={false} onChangeText={(value) => { setEmail(value); clearRegistrationError("email"); }} /><AuthTextInput label="Mobile number" placeholder="097 123 4567" value={phone} error={registrationErrors.phone} autoComplete="tel" keyboardType="phone-pad" onChangeText={(value) => { setPhone(value); clearRegistrationError("phone"); }} maxLength={16} /><AuthTextInput label="City" placeholder="e.g. Lusaka" value={city} error={registrationErrors.city} autoCapitalize="words" onChangeText={(value) => { setCity(value); clearRegistrationError("city"); }} /><AuthPasswordInput label="Create password" placeholder="At least 8 characters" value={password} error={registrationErrors.password} autoComplete="new-password" textContentType="newPassword" onChangeText={(value) => { setPassword(value); clearRegistrationError("password"); }} /><View style={styles.terms}><Text style={styles.termsText}>By creating an account, you agree to the Terms of Service and Privacy Policy.</Text></View></AuthScreen>;
}

const styles = StyleSheet.create({
  terms: { paddingHorizontal: 4 },
  termsText: { color: nwcColors.muted, textAlign: "center", fontSize: 11, lineHeight: 17, fontFamily: "Poppins_500Medium" },
});
