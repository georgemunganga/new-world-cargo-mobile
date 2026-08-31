import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";
import { DeliverySnapshot } from "@/components/home/delivery-snapshot";
import { HomeServiceTile } from "@/components/home/home-service-tile";
import { MyOrderRow } from "@/components/home/my-order-row";
import { AppIcon } from "@/components/ui/app-icon";
import { IconButton, Screen } from "@/components/ui/nwc-ui";
import { shipments } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function HomeScreen() {
  const { customer } = useCustomerAuth();
  const activeShipment = shipments[0];
  const orders = shipments.slice(0, 3);
  const openSend = () => router.push("/send" as Href);
  return <Screen><View style={styles.page}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.commandBar}><View style={styles.brand}><View style={styles.brandMark}><AppIcon name="arrow-top-right" size={19} color={nwcColors.primaryInk} /></View><Image accessibilityLabel="New WorldCargo" source={require("../../assets/images/new-world-cargo-wordmark.png")} resizeMode="contain" style={styles.wordmark} /></View><View style={styles.commandActions}><IconButton label="Open notifications" icon="bell-outline" badge onPress={() => router.push("/notifications" as Href)} /><TouchableOpacity accessibilityRole="button" accessibilityLabel="Open Account" onPress={() => router.push("/account" as Href)} style={styles.avatar}><Text style={styles.avatarText}>{(customer?.name || "C").trim().slice(0, 1).toUpperCase()}</Text></TouchableOpacity></View></View><DeliverySnapshot shipment={activeShipment} onPress={() => router.push(`/shipments/${activeShipment.id}` as Href)} /><View style={styles.serviceRows}><View style={styles.serviceRow}><HomeServiceTile title="International Imports" subtitle="From any country" capacity="< 1000 kg" icon="ferry" image={require("../../assets/images/services/cargo-parcel-transparent.png")} onPress={openSend} /><HomeServiceTile title="City-to-City" subtitle="Between cities" capacity="< 1000 kg" icon="truck-outline" image={require("../../assets/images/services/new-world-truck.png")} onPress={openSend} /></View><View style={styles.serviceRow}><HomeServiceTile title="Local Delivery" subtitle="Within your city" capacity="< 100 kg" icon="moped-outline" image={require("../../assets/images/services/new-world-scooter.png")} variant="wide" onPress={() => router.push("/local-delivery/route" as Href)} /><HomeServiceTile title="Custom Request" icon="arrow-top-right" variant="custom" onPress={openSend} /></View></View><View style={styles.ordersSection}><View style={styles.sectionHeader}><Text style={styles.sectionTitle}>My Shipments</Text><TouchableOpacity accessibilityRole="button" accessibilityLabel="View all shipments" onPress={() => router.push("/shipments" as Href)} style={styles.sectionAction}><Text style={styles.sectionActionText}>View all</Text><AppIcon name="chevron-right" size={18} color={nwcColors.foreground} /></TouchableOpacity></View><View style={styles.ordersList}>{orders.map((shipment) => <MyOrderRow key={shipment.id} shipment={shipment} onPress={() => router.push(`/shipments/${shipment.id}` as Href)} />)}</View></View></ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 38, gap: 20 },
  commandBar: { minHeight: 66, borderRadius: 24, paddingHorizontal: 12, backgroundColor: "#0B151C", flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  brand: { flexDirection: "row", alignItems: "center", gap: 9 },
  brandMark: { height: 39, width: 39, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  wordmark: { width: 120, height: 38 },
  commandActions: { flexDirection: "row", alignItems: "center", gap: 8 },
  avatar: { height: 38, width: 38, borderRadius: 19, alignItems: "center", justifyContent: "center", backgroundColor: "#D6E3E8", borderWidth: 2, borderColor: nwcColors.primary },
  avatarText: { color: nwcColors.brandNavy, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  serviceRows: { gap: 10 },
  serviceRow: { flexDirection: "row", justifyContent: "space-between", gap: 10 },
  sectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 12 },
  sectionTitle: { color: nwcColors.foreground, fontSize: 20, lineHeight: 26, fontFamily: "Poppins_800ExtraBold", letterSpacing: -0.2 },
  sectionAction: { minHeight: 34, flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 3 },
  sectionActionText: { color: nwcColors.info, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_800ExtraBold" },
  serviceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, justifyContent: "space-between" },
  ordersSection: { gap: 6 },
  ordersList: { borderTopWidth: 1, borderTopColor: "#E9EEF0" },
});
