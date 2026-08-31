import { router } from "expo-router";
import { useState } from "react";
import { AuthScreen, AuthTextInput } from "@/components/auth/auth-shell";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function ProfileScreen() {
  const [name, setName] = useState("");
  const [city, setCity] = useState("Lusaka");
  const { completeProfile } = useCustomerAuth();
  const saveProfile = async () => { await completeProfile({ name, city }); router.replace("/(tabs)"); };
  return <AuthScreen showBack title="Let us set up your account." detail="Add a few details to personalize your customer experience and delivery updates." primaryLabel="Enter New WorldCargo" onPrimary={saveProfile} primaryDisabled={name.trim().length < 2} secondaryLabel="Back" onSecondary={() => router.back()}><AuthTextInput label="Your full name" placeholder="e.g. Chanda Mwila" value={name} autoComplete="name" autoFocus onChangeText={setName} /><AuthTextInput label="Your city" placeholder="e.g. Lusaka" value={city} onChangeText={setCity} /></AuthScreen>;
}
