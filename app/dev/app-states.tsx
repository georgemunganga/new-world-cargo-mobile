import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, Screen, SectionHeader, StatusBadge } from "@/components/ui/nwc-ui";
import { startupScenarioLabel, type StartupScenario } from "@/lib/startup-flow";
import { nwcColors } from "@/lib/nwc-theme";
import { useAppStartup } from "@/stores/app-startup";

const scenarios: StartupScenario[] = ["normal", "restoring", "offline", "maintenance", "required_update", "optional_update", "outage"];

export default function AppStateGalleryScreen() {
  const { scenario, setScenario } = useAppStartup();
  const chooseScenario = (next: StartupScenario) => { setScenario(next); if (next === "normal") router.replace("/" as Href); else router.replace("/startup" as Href); };
  return <Screen><View style={styles.page}><View style={styles.header}><View><Text style={styles.eyebrow}>Development controls</Text><SectionHeader title="App states" /></View><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /></View><ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}><View style={styles.banner}><AppIcon name="flask-outline" size={21} color={nwcColors.primaryInk} /><Text style={styles.bannerText}>These controls are only for the frontend mock-data build. They let the team review startup and recovery experiences without live services.</Text></View>{scenarios.map((item) => <TouchableOpacity key={item} accessibilityRole="button" accessibilityLabel={`Preview ${startupScenarioLabel(item)}`} onPress={() => chooseScenario(item)} activeOpacity={0.76}><Card style={[styles.stateCard, scenario === item && styles.selectedCard]}><View style={styles.stateCopy}><Text style={styles.stateTitle}>{startupScenarioLabel(item)}</Text><Text style={styles.stateDetail}>{descriptionFor(item)}</Text></View>{scenario === item ? <StatusBadge label="Selected" tone="success" icon="check" /> : <AppIcon name="chevron-right" size={21} color={nwcColors.muted} />}</Card></TouchableOpacity>)}</ScrollView></View></Screen>;
}

function descriptionFor(scenario: StartupScenario) {
  return { normal: "Route to the signed-in or signed-out customer entry point.", restoring: "Show profile and booking-draft restoration status.", offline: "Show safe access to locally stored customer information.", maintenance: "Show a planned platform maintenance message.", required_update: "Block access until an essential app update is complete.", optional_update: "Offer an upgrade while allowing the customer to continue.", outage: "Explain an unexpected service interruption and recovery action." }[scenario];
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 16 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.7, textTransform: "uppercase", marginBottom: 2 },
  content: { gap: 11, paddingTop: 14, paddingBottom: 30 },
  banner: { flexDirection: "row", alignItems: "flex-start", gap: 10, borderRadius: 16, padding: 14, backgroundColor: "#FBF0D8", marginBottom: 2 },
  bannerText: { color: nwcColors.warning, flex: 1, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_600SemiBold" },
  stateCard: { minHeight: 84, flexDirection: "row", alignItems: "center", gap: 12 },
  selectedCard: { borderColor: nwcColors.success, backgroundColor: "#F0F9F5" },
  stateCopy: { flex: 1, gap: 3 },
  stateTitle: { color: nwcColors.foreground, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
  stateDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_500Medium" },
});
