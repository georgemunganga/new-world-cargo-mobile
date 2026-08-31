import { ScrollView, StyleSheet, Text, View } from "react-native";
import { router, type Href } from "expo-router";
import { AccountRow } from "@/components/account/account-row";
import { AppIcon } from "@/components/ui/app-icon";
import { Card, PrimaryButton, Screen, SectionHeader, StatusBadge } from "@/components/ui/nwc-ui";
import { nwcColors } from "@/lib/nwc-theme";
import { useCustomerAuth } from "@/stores/customer-auth";

export default function AccountScreen() {
  const { customer, signOut } = useCustomerAuth();
  const initials = customer?.name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase() || "NW";
  const leaveAccount = async () => { await signOut(); router.replace("/auth/welcome" as Href); };
  return <Screen><View style={styles.page}><ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}><View><Text style={styles.eyebrow}>Customer profile</Text><SectionHeader title="Account" /></View><Card style={styles.profileCard}><View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View><View style={styles.profileCopy}><Text style={styles.profileName}>{customer?.name || "New WorldCargo customer"}</Text><Text style={styles.profileDetail}>{`Individual customer · ${customer?.city || "Lusaka"}`}</Text><StatusBadge label="Phone verified" tone="success" icon="account-check-outline" /></View></Card><Card style={styles.listCard}><AccountRow icon="map-marker-outline" title="Saved places" detail="Home, work, branch, and other delivery locations" /><View style={styles.divider} /><AccountRow icon="account-multiple-outline" title="Recipients" detail="People and businesses you send Katundu to" /><View style={styles.divider} /><AccountRow icon="credit-card-outline" title="Payment methods" detail="Available methods will appear before you pay" /></Card><SectionHeader eyebrow="Help and preferences" title="More for you" /><Card style={styles.listCard}><AccountRow icon="bell-outline" title="Notifications" detail="Shipment, bill, and delivery updates" /><View style={styles.divider} /><AccountRow icon="headset" title="Support" detail="Get help with a shipment, delivery, or booking" /><View style={styles.divider} /><AccountRow icon="shield-check-outline" title="Privacy and security" detail="Manage permissions, security, and legal information" /></Card><SectionHeader eyebrow="Build preview" title="Development tools" /><Card style={styles.listCard}><AccountRow icon="flask-outline" title="App state gallery" detail="Preview startup, offline, maintenance, update, and outage states" onPress={() => router.push("/dev/app-states" as Href)} /></Card><View style={styles.note}><AppIcon name="information-outline" size={19} color={nwcColors.info} /><Text style={styles.noteText}>Your local profile is stored securely on this device for the frontend preview. Live identity verification and account data will replace it when the production authentication service is connected.</Text></View><PrimaryButton label="Sign out" icon="logout" onPress={leaveAccount} /></ScrollView></View></Screen>;
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: nwcColors.background },
  content: { paddingHorizontal: 20, paddingTop: 22, paddingBottom: 30, gap: 19 },
  eyebrow: { color: nwcColors.info, fontSize: 12, lineHeight: 16, fontWeight: "800", letterSpacing: 0.6, textTransform: "uppercase", marginBottom: 2 },
  profileCard: { flexDirection: "row", alignItems: "center", gap: 13 },
  avatar: { height: 58, width: 58, borderRadius: 20, backgroundColor: nwcColors.primary, alignItems: "center", justifyContent: "center" },
  avatarText: { color: nwcColors.primaryInk, fontSize: 17, lineHeight: 22, fontWeight: "800" },
  profileCopy: { flex: 1, gap: 2 },
  profileName: { color: nwcColors.foreground, fontSize: 18, lineHeight: 24, fontWeight: "800" },
  profileDetail: { color: nwcColors.muted, fontSize: 13, lineHeight: 18, fontWeight: "600", marginBottom: 5 },
  listCard: { paddingVertical: 2 },
  divider: { height: 1, backgroundColor: nwcColors.border, marginLeft: 54 },
  note: { flexDirection: "row", gap: 9, borderRadius: 16, backgroundColor: "#EAF4F8", padding: 14, alignItems: "flex-start" },
  noteText: { flex: 1, color: nwcColors.info, fontSize: 12, lineHeight: 18, fontWeight: "600" },
});
