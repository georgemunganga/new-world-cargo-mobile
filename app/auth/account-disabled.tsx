import { router, type Href } from "expo-router";
import { AuthScreen } from "@/components/auth/auth-shell";

export default function AccountDisabledScreen() {
  return <AuthScreen showBack title="Account not enabled" detail="This account is not enabled for the customer portal yet. Contact New WorldCargo support so we can connect it to customer access." primaryLabel="Back to sign in" onPrimary={() => router.replace("/auth/phone" as Href)} secondaryLabel="Open support" onSecondary={() => router.push("/support" as Href)} />;
}
