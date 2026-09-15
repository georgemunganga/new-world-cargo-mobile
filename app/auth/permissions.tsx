import { Image, StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAppToast } from "@/components/ui/app-toast";
import { PrimaryButton } from "@/components/ui/nwc-ui";
import type { CustomerPermission, CustomerPermissionStatus } from "@/lib/domain/permission";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerPermissions } from "@/lib/use-cases/use-customer-permissions";
import { useAppStartup } from "@/stores/app-startup";

const onboardingPermissions: CustomerPermission[] = [
  "location",
  "notifications",
  "camera",
  "photos",
  "contacts",
];

export default function PermissionWelcomeScreen() {
  const { requestPermission } = useCustomerPermissions();
  const { completeOnboarding } = useAppStartup();
  const toast = useAppToast();

  const requestPermissions = async () => {
    const results: (readonly [CustomerPermission, CustomerPermissionStatus])[] = [];
    for (const permission of onboardingPermissions) {
      results.push([permission, await requestPermission(permission)] as const);
    }
    const allowed = results.filter(([, status]) => status === "granted").length;
    if (allowed === results.length) toast.success("Permissions are ready.");
    else toast.info("You can change permissions later in Account settings.");
    await completeOnboarding();
    router.replace("/auth/phone" as Href);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Image
          accessibilityLabel="New WorldCargo"
          source={require("../../assets/images/new-world-cargo-logo.png")}
          resizeMode="contain"
          style={styles.logo}
        />
      </View>

      <View style={styles.message}>
        <Text style={styles.title}>Keep your Katundu moving.</Text>
        <Text style={styles.detail}>Allow location, notifications, camera, photos and contacts so pickups, delivery updates and cargo details work smoothly.</Text>
      </View>

      <PrimaryButton
        label="Allow permissions"
        accessibilityHint="Request the device permissions used by New WorldCargo"
        onPress={requestPermissions}
        style={styles.continueButton}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: nwcColors.white,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 18,
  },
  header: {
    alignItems: "center",
  },
  logo: {
    width: 190,
    height: 76,
  },
  message: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingHorizontal: 12,
  },
  title: {
    color: nwcColors.foreground,
    textAlign: "center",
    fontSize: 34,
    lineHeight: 42,
    letterSpacing: -0.8,
    fontFamily: "Poppins_800ExtraBold",
  },
  detail: {
    maxWidth: 310,
    color: nwcColors.muted,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 23,
    fontFamily: "Poppins_500Medium",
  },
  continueButton: {
    width: "100%",
  },
});
