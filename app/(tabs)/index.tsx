import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { router, type Href } from "expo-router";
import { ActionRequiredCard, ServiceCard, ShipmentCard } from "@/components/domain/cargo-cards";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, Heading, IconButton, PrimaryButton, SectionHeader } from "@/components/ui/nwc-ui";
import { shipments } from "@/lib/mock-cargo-data";
import { nwcColors } from "@/lib/nwc-theme";
import { useBookingDraft } from "@/stores/booking-draft";
import { useCustomerAuth } from "@/stores/customer-auth";
import { firstName } from "@/lib/auth-flow";

export default function HomeScreen() {
  const activeShipment = shipments[0];
  const { updateLocalDraft } = useBookingDraft();
  const { customer } = useCustomerAuth();
  const openLocalDelivery = () => router.push("/local-delivery/route" as Href);
  const repeatDelivery = () => {
    updateLocalDraft({ pickup: activeShipment.pickup, destination: activeShipment.destination, step: "route" });
    router.push("/local-delivery/route" as Href);
  };
  return <View style={styles.page}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View style={styles.header}><View><Image source={require("../../assets/images/new-world-cargo-logo.png")} contentFit="contain" accessibilityLabel="New WorldCargo" style={styles.logo} /><Text style={styles.location}><AppIcon name="map-marker-outline" size={15} color={nwcColors.info} /> {customer?.city || "Lusaka"}, Zambia</Text><Heading style={styles.greeting}>{`Good afternoon, ${firstName(customer?.name || "there")}.`}</Heading><Text style={styles.subheading}>Move and track your Katundu in one place.</Text></View><IconButton label="Open notifications" icon="bell-outline" badge onPress={() => router.push("/notifications" as Href)} /></View><ActionRequiredCard title="Your cargo is ready for a final payment" detail="Review the bill before your import shipment moves." onPress={() => router.push("/bills")} /><SectionHeader eyebrow="Active shipment" title="On the way to you" action={<TouchableOpacity accessibilityRole="button" accessibilityLabel="View all shipments" onPress={() => router.push("/shipments")}><Text style={styles.link}>View all</Text></TouchableOpacity>} /><ShipmentCard shipment={activeShipment} onPress={() => router.push(`/shipments/${activeShipment.id}` as Href)} /><SectionHeader eyebrow="Send new Katundu" title="Where are you sending it?" /><Card style={styles.routeStarter}><TouchableOpacity accessibilityRole="button" accessibilityLabel="Choose pickup location" onPress={openLocalDelivery} style={styles.routeRow}><View style={styles.routeIconOrigin}><AppIcon name="circle-outline" size={18} color={nwcColors.brandNavy} /></View><View style={styles.routeTextWrap}><Text style={styles.routeLabel}>From where?</Text><Text style={styles.routeHint}>Choose a pickup location</Text></View><AppIcon name="chevron-right" size={22} color={nwcColors.muted} /></TouchableOpacity><View style={styles.routeDivider} /><TouchableOpacity accessibilityRole="button" accessibilityLabel="Choose destination location" onPress={openLocalDelivery} style={styles.routeRow}><View style={styles.routeIconDestination}><AppIcon name="map-marker" size={18} color={nwcColors.primaryInk} /></View><View style={styles.routeTextWrap}><Text style={styles.routeLabel}>To where?</Text><Text style={styles.routeHint}>Choose a delivery location</Text></View><AppIcon name="chevron-right" size={22} color={nwcColors.muted} /></TouchableOpacity></Card><View style={styles.services}><ServiceCard service="local" onPress={openLocalDelivery} /><ServiceCard service="intercity" status="next" /><ServiceCard service="import" status="next" /></View><SectionHeader eyebrow="Your account" title="Bills and balance" /><TouchableOpacity accessibilityRole="button" accessibilityLabel="Open Bills" accessibilityHint="No payment is due right now" onPress={() => router.push("/bills")} activeOpacity={0.82} style={styles.balanceCard}><View><Text style={styles.balanceOverline}>Cargo wallet</Text><Text style={styles.balanceTitle}>No bills due</Text><Text style={styles.balanceDetail}>Invoices, receipts, and credits are kept here.</Text></View><View style={styles.balanceIcon}><AppIcon name="wallet-outline" size={25} color={nwcColors.primaryInk} /></View></TouchableOpacity><View style={styles.repeatCard}><View style={styles.repeatIcon}><AppIcon name="history" size={21} color={nwcColors.brandNavy} /></View><View style={styles.repeatCopy}><Text style={styles.repeatTitle}>Repeat your last Local Delivery</Text><Text style={styles.repeatDetail}>Reuse your most recent pickup and destination.</Text></View></View><PrimaryButton label="Repeat Local Delivery" icon="arrow-right" onPress={repeatDelivery} /></ScrollView></View>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  content: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 30, gap: 22 },
  header: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between", gap: 12 },
  logo: { width: 136, height: 54, alignSelf: "flex-start", marginLeft: -5, marginBottom: 2 },
  location: { color: nwcColors.info, fontSize: 12, lineHeight: 17, fontWeight: "800", flexDirection: "row", alignItems: "center" },
  greeting: { marginTop: 6, maxWidth: 284 },
  subheading: { color: nwcColors.muted, fontSize: 15, lineHeight: 22, fontWeight: "500", marginTop: 5 },
  link: { color: nwcColors.info, fontSize: 13, lineHeight: 18, fontWeight: "800" },
  routeStarter: { paddingVertical: 4, paddingHorizontal: 16 },
  routeRow: { minHeight: 62, flexDirection: "row", alignItems: "center", gap: 11 },
  routeIconOrigin: { height: 34, width: 34, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: "#EAF1F4" },
  routeIconDestination: { height: 34, width: 34, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  routeTextWrap: { flex: 1, gap: 1 },
  routeLabel: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontWeight: "800" },
  routeHint: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontWeight: "500" },
  routeDivider: { height: 1, backgroundColor: nwcColors.border, marginLeft: 45 },
  services: { gap: 10, marginTop: -8 },
  balanceCard: { minHeight: 128, borderRadius: 20, backgroundColor: nwcColors.brandNavy, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 14 },
  balanceOverline: { color: "#C5D0D7", fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.5, textTransform: "uppercase" },
  balanceTitle: { color: nwcColors.white, fontSize: 24, lineHeight: 30, fontWeight: "800", marginTop: 4 },
  balanceDetail: { color: "#C5D0D7", fontSize: 12, lineHeight: 17, fontWeight: "600", marginTop: 3 },
  balanceIcon: { width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  repeatCard: { flexDirection: "row", alignItems: "center", gap: 12, marginTop: -6 },
  repeatIcon: { width: 42, height: 42, borderRadius: 14, backgroundColor: "#EAF1F4", alignItems: "center", justifyContent: "center" },
  repeatCopy: { flex: 1, gap: 2 },
  repeatTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontWeight: "800" },
  repeatDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontWeight: "500" },
});
