import { Redirect, type Href } from "expo-router";
import { authEntryPath } from "@/lib/customer-session";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function IndexRedirect() {
  const { customer } = useCustomerAuth();
  return <Redirect href={authEntryPath(customer) as Href} />;
}
