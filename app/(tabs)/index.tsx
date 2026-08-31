import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { RouteEntryCard } from "@/components/booking/route-entry-card";
import { DeliverySnapshot } from "@/components/home/delivery-snapshot";
import { HomeServiceTile } from "@/components/home/home-service-tile";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton, Screen } from "@/components/ui/nwc-ui";
import { shipments } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";
import { firstName } from "@/lib/auth-flow";

export default function HomeScreen() {
  const activeShipment = shipments[0];
  const { customer } = useCustomerAuth();
  const openSend = () => router.push("/send" as Href);
  return <Screen><View style={styles.page}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.commandBar}><View style={styles.brand}><View style={styles.brandMark}><AppIcon name="arrow-top-right" size={19} color={nwcColors.primaryInk} /></View><Text style={styles.brandText}>NewWorld.</Text></View><View style={styles.commandActions}><IconButton label="Open notifications" icon="bell-outline" badge onPress={() => router.push("/notifications" as Href)} /><View accessibilityLabel={`${customer?.name || "Customer"} profile`} style={styles.avatar}><Text style={styles.avatarText}>{firstName(customer?.name || "C").slice(0, 1).toUpperCase()}</Text></View></View></View><View style={styles.welcomeRow}><View><Text style={styles.welcomeLabel}>Good afternoon</Text><Text style={styles.welcomeName}>{firstName(customer?.name || "there")}</Text></View><Text style={styles.location}><AppIcon name="map-marker-outline" size={15} color={nwcColors.info} /> {customer?.city || "Lusaka"}</Text></View><DeliverySnapshot shipment={activeShipment} onPress={() => router.push(`/shipments/${activeShipment.id}` as Href)} /><View style={styles.sendContainer}><View style={styles.sendHeader}><View><Text style={styles.sectionLabel}>Send Katundu</Text><Text style={styles.sectionTitle}>Where are you sending?</Text></View><View style={styles.sendIcon}><AppIcon name="arrow-top-right" size={20} color={nwcColors.primaryInk} /></View></View><RouteEntryCard from={{ value: "Add pickup", detail: "Choose where we collect" }} to={{ value: "Add destination", detail: "Choose where we deliver" }} onFromPress={openSend} onToPress={openSend} /><View style={styles.servicesHeader}><Text style={styles.servicesTitle}>Choose a service</Text><Text style={styles.servicesHint}>Start</Text></View><View style={styles.serviceGrid}><HomeServiceTile label="Local Delivery" icon="truck-fast-outline" accent onPress={() => router.push("/local-delivery/route" as Href)} /><HomeServiceTile label="City to City" icon="package-variant-closed" onPress={openSend} /><HomeServiceTile label="Import Cargo" icon="airplane" onPress={openSend} /></View></View></ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 126, gap: 16 },
  commandBar: { minHeight: 68, borderRadius: 24, paddingHorizontal: 12, backgroundColor: "#0B151C", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { flexDirection: "row", alignItems: "center", gap: 9 },
  brandMark: { height: 39, width: 39, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  brandText: { color: nwcColors.white, fontSize: 17, lineHeight: 22, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.25 },
  commandActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  avatar: { height: 38, width: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "#D6E3E8", borderWidth: 2, borderColor: nwcColors.primary },
  avatarText: { color: nwcColors.brandNavy, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  welcomeRow: { flexDirection: "row", alignItems: "flex-end", justifyContent: "space-between", paddingHorizontal: 2, marginTop: 2 },
  welcomeLabel: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_600SemiBold" },
  welcomeName: { color: nwcColors.foreground, fontSize: 27, lineHeight: 33, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.5 },
  location: { color: nwcColors.info, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold", marginBottom: 4 },
  sendContainer: { borderRadius: 28, padding: 16, gap: 15, backgroundColor: "#F0F5F6", borderWidth: 1, borderColor: "#E3EAEC" },
  sendHeader: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  sectionLabel: { color: nwcColors.info, fontSize: 10, lineHeight: 14, fontFamily: "Poppins_800ExtraBold", letterSpacing: 0.7, textTransform: "uppercase" },
  sectionTitle: { color: nwcColors.foreground, fontSize: 22, lineHeight: 28, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.25, marginTop: 1 },
  sendIcon: { width: 39, height: 39, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  servicesHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 1 },
  servicesTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  servicesHint: { color: nwcColors.muted, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_700Bold" },
  serviceGrid: { flexDirection: "row", gap: 8 },
});
