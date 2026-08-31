import { ActivityIndicator, View } from "react-native";
import { Redirect, type Href } from "expo-router";
import { nwcColors } from "@/lib/nwc-theme";
import { authEntryPath } from "@/lib/customer-session";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function IndexRedirect() {
  const { customer, isRestoring } = useCustomerAuth();
  if (isRestoring) return <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: nwcColors.background }}><ActivityIndicator color={nwcColors.brandNavy} /></View>;
  return <Redirect href={authEntryPath(customer) as Href} />;
}
