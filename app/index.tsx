import { Redirect, type Href } from "expo-router";
import { startupDestination } from "@/lib/startup-flow";
import { useAppStartup } from "@/stores/app-startup";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function IndexRedirect() {
  const { customer } = useCustomerAuth();
  const { scenario } = useAppStartup();
  return <Redirect href={startupDestination(scenario, Boolean(customer)) as Href} />;
}
