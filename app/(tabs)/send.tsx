import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { ServiceCard } from "@/components/domain/cargo-cards";
import { RouteEntryCard } from "@/components/booking/route-entry-card";
import { Card, Screen, SectionHeader } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

export default function SendScreen() {
  const openLocalRoute = () => router.push("/local-delivery/route" as Href);
  return <Screen><View style={styles.page}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View><Text style={styles.eyebrow}>New booking</Text><SectionHeader title="Send Katundu" /><Text style={styles.detail}>Start with your route, then choose the service that fits your cargo.</Text></View><RouteEntryCard from={{ value: "Add pickup", detail: "Choose where we collect" }} to={{ value: "Add destination", detail: "Choose where we deliver" }} onFromPress={openLocalRoute} onToPress={openLocalRoute} /><View style={styles.services}><ServiceCard service="local" onPress={openLocalRoute} /><ServiceCard service="intercity" status="next" /><ServiceCard service="import" status="next" /></View><Card style={styles.note}><Text style={styles.noteTitle}>More services are coming next</Text><Text style={styles.noteDetail}>Local Delivery is ready for the frontend preview. Import and City-to-City will follow the same simple route-first pattern.</Text></Card></ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 126, gap: 20 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 2 },
  detail: { color: nwcColors.muted, fontSize: 15, lineHeight: 22, fontWeight: "500", marginTop: -4 },
  services: { gap: 11 },
  note: { backgroundColor: nwcColors.brandNavy, borderColor: nwcColors.brandNavy, gap: 5 },
  noteTitle: { color: nwcColors.white, fontSize: 16, lineHeight: 21, fontWeight: "800" },
  noteDetail: { color: "#C5D0D7", fontSize: 13, lineHeight: 19, fontWeight: "600" },
});
