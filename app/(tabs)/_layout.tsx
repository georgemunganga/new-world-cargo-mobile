import { Redirect, Tabs } from "expo-router";
import { FloatingCapsuleTabBar } from "@/components/navigation/floating-capsule-tab-bar";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function CustomerTabLayout() {
  const { customer, isRestoring } = useCustomerAuth();
  if (!isRestoring && !customer) return <Redirect href="/auth/welcome" />;
  if (isRestoring) return null;
  return <Tabs tabBar={(props) => <FloatingCapsuleTabBar {...props} />} screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="index" options={{ title: "Home" }} />
    <Tabs.Screen name="shipments" options={{ title: "Shipments" }} />
    <Tabs.Screen name="send" options={{ title: "Send" }} />
    <Tabs.Screen name="bills" options={{ title: "Bills" }} />
    <Tabs.Screen name="account" options={{ title: "Account" }} />
  </Tabs>;
}
