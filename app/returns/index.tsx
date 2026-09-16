import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { router, type Href } from "expo-router";

import { AppIcon } from "@/components/ui/app-icon";
import { ListSkeleton } from "@/components/ui/skeleton";
import { Card, IconButton, PrimaryButton, Screen, StatusBadge } from "@/components/ui/nwc-ui";
import { returnStatusPresentation } from "@/lib/domain/return-request";
import { nwcColors } from "@/lib/nwc-theme";
import { useReturnRequests } from "@/lib/use-cases/use-return-requests";

export default function ReturnsScreen() {
  const { requests, status, errorMessage, refresh } = useReturnRequests();

  return (
    <Screen>
      <View style={styles.page}>
        <View style={styles.header}>
          <IconButton label="Go back" icon="arrow-left" onPress={() => router.back()} />
          <Text style={styles.headerTitle}>Returns</Text>
          <View style={styles.headerSpacer} />
        </View>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.lead}>
            <Text style={styles.title}>Your returns</Text>
            <Text style={styles.detail}>Track every return you have asked New WorldCargo to handle.</Text>
          </View>

          {status === "loading" ? <ListSkeleton count={3} /> : null}

          {status === "error" ? (
            <Card style={styles.state}>
              <View style={styles.stateIcon}><AppIcon name="alert-circle-outline" size={24} color={nwcColors.warning} /></View>
              <Text style={styles.stateTitle}>We could not load your returns</Text>
              <Text style={styles.stateDetail}>{errorMessage || "Try again when your connection is stable."}</Text>
              <PrimaryButton label="Try again" onPress={() => void refresh()} />
            </Card>
          ) : null}

          {status !== "loading" && status !== "error" && !requests.length ? (
            <Card style={styles.state}>
              <View style={styles.stateIcon}><AppIcon name="undo-variant" size={24} color={nwcColors.info} /></View>
              <Text style={styles.stateTitle}>No returns yet</Text>
              <Text style={styles.stateDetail}>When you ask us to return a delivered shipment, it will appear here with its status.</Text>
            </Card>
          ) : null}

          {requests.map((request) => {
            const presentation = returnStatusPresentation[request.status];
            return (
              <TouchableOpacity
                key={request.id}
                accessibilityRole="button"
                accessibilityLabel={`Return for ${request.shipmentReference}`}
                accessibilityHint={`Status ${presentation.label}. Opens the shipment.`}
                activeOpacity={0.74}
                onPress={() => router.push(`/shipments/${request.shipmentId}` as Href)}
                style={styles.row}
              >
                <View style={styles.rowIcon}><AppIcon name="undo-variant" size={20} color={nwcColors.brandNavy} /></View>
                <View style={styles.rowCopy}>
                  <Text numberOfLines={1} style={styles.rowTitle}>{request.shipmentReference}</Text>
                  <Text numberOfLines={1} style={styles.rowDetail}>{request.createdLabel}</Text>
                </View>
                <StatusBadge label={presentation.label} tone={presentation.tone} />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, paddingHorizontal: 20, paddingTop: 16, backgroundColor: nwcColors.background },
  header: { minHeight: 44, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerTitle: { color: nwcColors.brandNavy, fontSize: 15, lineHeight: 20, fontFamily: "Poppins_800ExtraBold" },
  headerSpacer: { width: 44, height: 44 },
  content: { paddingTop: 24, paddingBottom: 42, gap: 12 },
  lead: { gap: 4 },
  title: { color: nwcColors.foreground, fontSize: 29, lineHeight: 37, letterSpacing: -0.5, fontFamily: "Poppins_800ExtraBold" },
  detail: { color: nwcColors.muted, fontSize: 13, lineHeight: 19, fontFamily: "Poppins_500Medium" },
  row: { minHeight: 68, borderRadius: 20, backgroundColor: nwcColors.surface, borderWidth: 1, borderColor: "#E5ECEE", paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 11 },
  rowIcon: { width: 40, height: 40, borderRadius: 14, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.surfaceNavyTint },
  rowCopy: { flex: 1, gap: 2 },
  rowTitle: { color: nwcColors.foreground, fontSize: 14, lineHeight: 19, fontFamily: "Poppins_800ExtraBold" },
  rowDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 16, fontFamily: "Poppins_500Medium" },
  state: { alignItems: "center", gap: 8, padding: 22 },
  stateIcon: { width: 56, height: 56, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.surfaceNavyTint, marginBottom: 4 },
  stateTitle: { color: nwcColors.foreground, fontSize: 17, lineHeight: 23, fontFamily: "Poppins_800ExtraBold", textAlign: "center" },
  stateDetail: { color: nwcColors.muted, fontSize: 12, lineHeight: 18, fontFamily: "Poppins_500Medium", textAlign: "center", marginBottom: 6 },
});
