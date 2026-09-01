import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router } from "expo-router";

import { AppIcon } from "@/components/ui/app-icon";
import { Card, IconButton, Screen } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";

const helpTopics = [
  { icon: "package-variant-closed" as const, title: "Shipment question", detail: "Track a delivery or ask about a route." },
  { icon: "receipt-text-outline" as const, title: "Bill or payment", detail: "Ask about an invoice, receipt, or charge." },
  { icon: "message-question-outline" as const, title: "Other support", detail: "Start a general mock support request." },
];

export default function SupportScreen() {
  const openTopic = (title: string) => Alert.alert("Mock support request", `${title} is ready for a future support integration. No message has been sent from this preview.`);
  return <Screen><View style={styles.page}><View style={styles.header}><IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} /><Text style={styles.headerTitle}>Support</Text><View style={styles.headerSpacer} /></View><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.hero}><View style={styles.heroIcon}><AppIcon name="headset" size={25} color={nwcColors.primaryInk} /></View><Text style={styles.title}>How can we help?</Text><Text style={styles.detail}>Choose a topic and we will prepare the right support request. This is a mock frontend flow.</Text></View><View style={styles.topics}>{helpTopics.map((topic) => <TouchableOpacity key={topic.title} accessibilityRole="button" accessibilityLabel={topic.title} accessibilityHint={topic.detail} onPress={() => openTopic(topic.title)} activeOpacity={0.74} style={styles.topic}><View style={styles.topicIcon}><AppIcon name={topic.icon} size={21} color={nwcColors.brandNavy} /></View><View style={styles.topicCopy}><Text style={styles.topicTitle}>{topic.title}</Text><Text style={styles.topicDetail}>{topic.detail}</Text></View><AppIcon name="chevron-right" size={20} color={nwcColors.muted} /></TouchableOpacity>)}</View><Card style={styles.note}><Text style={styles.noteTitle}>Quick answer</Text><Text style={styles.noteDetail}>For payment questions, open the invoice from Bills to review the charges, receipt, reminder, or charge-review timeline.</Text></Card></ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background, paddingHorizontal: 20, paddingTop: 16 }, header: { minHeight: 44, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }, headerTitle: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" }, headerSpacer: { width: 44, height: 44 }, content: { flexGrow: 1, paddingTop: 26, paddingBottom: 42, gap: 22 }, hero: { gap: 7 }, heroIcon: { width: 50, height: 50, borderRadius: 18, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary }, title: { color: nwcColors.foreground, fontSize: 29, lineHeight: 37, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.5 }, detail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium" }, topics: { borderRadius: 23, overflow: "hidden", backgroundColor: nwcColors.surface, borderWidth: 1, borderColor: "#E5ECEE" }, topic: { minHeight: 78, paddingHorizontal: 14, flexDirection: "row", alignItems: "center", gap: 11, borderBottomWidth: 1, borderBottomColor: "#E7ECEE" }, topicIcon: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: "#EAF1F4" }, topicCopy: { flex: 1, gap: 2 }, topicTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" }, topicDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" }, note: { gap: 4, backgroundColor: "#F1F7F8" }, noteTitle: { color: nwcColors.brandNavy, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" }, noteDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium" },
});
