import { Redirect, Tabs } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomerTabIcon } from "@/components/navigation/customer-tab-icon";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function CustomerTabLayout() {
  const { customer, isRestoring } = useCustomerAuth();
  const insets = useSafeAreaInsets();
  const bottomPadding = Platform.OS === "web" ? 10 : Math.max(insets.bottom, 8);
  if (!isRestoring && !customer) return <Redirect href="/auth/welcome" />;
  if (isRestoring) return null;
  return <Tabs screenOptions={{
    headerShown: false,
    tabBarActiveTintColor: nwcColors.primary,
    tabBarInactiveTintColor: "#C5D0D7",
    tabBarLabelStyle: styles.label,
    tabBarStyle: [styles.tabBar, { height: 63 + bottomPadding, paddingBottom: bottomPadding }],
    tabBarItemStyle: styles.tabItem,
  }}>
    <Tabs.Screen name="index" options={{ title: "Home", tabBarIcon: ({ color, focused }) => <CustomerTabIcon icon="home-variant-outline" color={color} focused={focused} /> }} />
    <Tabs.Screen name="shipments" options={{ title: "Shipments", tabBarIcon: ({ color, focused }) => <CustomerTabIcon icon="package-variant-closed" color={color} focused={focused} /> }} />
    <Tabs.Screen name="send" options={{ title: "Send", tabBarIcon: ({ color, focused }) => <CustomerTabIcon icon="plus" color={color} focused={focused} featured /> }} />
    <Tabs.Screen name="bills" options={{ title: "Bills", tabBarIcon: ({ color, focused }) => <CustomerTabIcon icon="receipt-text-outline" color={color} focused={focused} /> }} />
    <Tabs.Screen name="account" options={{ title: "Account", tabBarIcon: ({ color, focused }) => <CustomerTabIcon icon="account-circle-outline" color={color} focused={focused} /> }} />
  </Tabs>;
}

const styles = StyleSheet.create({
  tabBar: { backgroundColor: nwcColors.brandNavy, borderTopColor: "transparent", paddingTop: 8, elevation: 0, shadowOpacity: 0 },
  tabItem: { paddingTop: 1 },
  label: { fontSize: 11, lineHeight: 14, fontWeight: "700", marginTop: 2 },
});
