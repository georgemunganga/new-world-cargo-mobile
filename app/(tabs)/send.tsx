import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { ServiceCard } from "@/components/domain/cargo-cards";
import { Card, Screen, SectionHeader } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

export default function SendScreen() {
  return <Screen><View style={styles.page}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View><Text style={styles.eyebrow}>New booking</Text><SectionHeader title="What are you sending?" /><Text style={styles.detail}>Choose the route that matches your cargo. You will see the service details before confirming.</Text></View><View style={styles.services}><ServiceCard service="local" onPress={() => router.push("/local-delivery/route" as Href)} /><ServiceCard service="intercity" status="next" /><ServiceCard service="import" status="next" /></View><Card style={styles.note}><Text style={styles.noteTitle}>A simpler cargo journey</Text><Text style={styles.noteDetail}>Every booking follows the same clear pattern: route, cargo, contacts, schedule, review, and confirmation. Import Cargo and City-to-City Katundu will be introduced next.</Text></Card></ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 30, gap: 24 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 2 },
  detail: { color: nwcColors.muted, fontSize: 15, lineHeight: 22, fontWeight: "500", marginTop: -4 },
  services: { gap: 11 },
  note: { backgroundColor: nwcColors.brandNavy, borderColor: nwcColors.brandNavy, gap: 5 },
  noteTitle: { color: nwcColors.white, fontSize: 16, lineHeight: 21, fontWeight: "800" },
  noteDetail: { color: "#C5D0D7", fontSize: 13, lineHeight: 19, fontWeight: "600" },
});
