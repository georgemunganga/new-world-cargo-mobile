import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { ServiceCard } from "@/components/domain/cargo-cards";
import { useFloatingNavigationClearance } from "@/components/navigation/use-floating-navigation-clearance";
import { Screen, SectionHeader } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

export default function SendScreen() {
  const floatingNavigationClearance = useFloatingNavigationClearance();
  const openLocalRoute = () => router.push("/local-delivery/route" as Href);
  return <Screen><View style={styles.page}><ScrollView contentContainerStyle={[styles.content, { paddingBottom: floatingNavigationClearance }]} showsVerticalScrollIndicator={false}><View><Text style={styles.eyebrow}>New booking</Text><SectionHeader title="Choose a service" /><Text style={styles.detail}>Start with the kind of cargo move you need. Add your route only after choosing.</Text></View><View style={styles.services}><ServiceCard service="local" image={require("../../assets/images/services/new-world-scooter.png")} onPress={openLocalRoute} /><ServiceCard service="intercity" image={require("../../assets/images/services/new-world-truck.png")} onPress={() => router.push("/intercity/route" as Href)} /><ServiceCard service="import" image={require("../../assets/images/services/cargo-parcel-transparent.png")} onPress={() => router.push("/import/method" as Href)} /></View><View style={styles.footerNote}><Text style={styles.footerTitle}>Need something different?</Text><Text style={styles.footerDetail}>Choose Custom Request from Home and we will shape a cargo move around your needs.</Text></View></ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  content: { paddingHorizontal: 20, paddingTop: 22, gap: 22 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 2 },
  detail: { color: nwcColors.muted, fontSize: 15, lineHeight: 22, fontWeight: "500", marginTop: -4 },
  services: { gap: 12 },
  footerNote: { gap: 3, paddingHorizontal: 4 },
  footerTitle: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  footerDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
});
