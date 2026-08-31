import { Redirect, Stack } from "expo-router";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function AuthLayout() {
  const { customer, isRestoring } = useCustomerAuth();
  if (!isRestoring && customer) return <Redirect href="/(tabs)" />;
  return <Stack screenOptions={{ headerShown: false, animation: "fade" }} />;
}
