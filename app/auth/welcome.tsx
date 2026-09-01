import { Image, StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { PrimaryButton } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

export default function WelcomeScreen() {
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
        <Text style={styles.title}>Move your Katundu with confidence.</Text>
        <Text style={styles.detail}>Simple local delivery and cargo tracking, all in one place.</Text>
      </View>

      <PrimaryButton
        label="Continue"
        accessibilityHint="Open the sign in screen"
        onPress={() => router.push("/auth/phone" as Href)}
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
