import { router, type Href } from "expo-router";
import { AuthScreen } from "@/components/auth/auth-shell";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function SessionExpiredScreen() {
  const { signOut } = useCustomerAuth();
  const continueToLogin = async () => {
    await signOut();
    router.replace("/auth/phone" as Href);
  };
  return <AuthScreen title="Session expired" detail="For your account safety, please sign in again to continue managing your cargo." primaryLabel="Sign in again" onPrimary={continueToLogin} />;
}
