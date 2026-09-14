import { type ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { CustomerMap } from "@/components/map/customer-map";
import { IconButton, Screen } from "@/components/ui/nwc-ui";
import {
  deliveryMapModeForService,
  type DeliveryMapService,
} from "@/lib/domain/delivery-map";
import { nwcColors } from "@/lib/nwc-theme";
import { useBookingDrawerSnap } from "@/lib/use-cases/use-booking-drawer-snap";
import type { Address } from "@/types/cargo";

type BookingMapDrawerFrameProps = {
  service: DeliveryMapService;
  serviceLabel: string;
  stepLabel: string;
  stepPosition: string;
  title: string;
  detail: string;
  pickup?: Address;
  destination?: Address;
  routeReady: boolean;
  footer: ReactNode;
  children: ReactNode;
};

export function BookingMapDrawerFrame({
  service,
  serviceLabel,
  stepLabel,
  stepPosition,
  title,
  detail,
  pickup,
  destination,
  routeReady,
  footer,
  children,
}: BookingMapDrawerFrameProps) {
  const insets = useSafeAreaInsets();
  const { height: viewportHeight } = useWindowDimensions();
  const {
    expanded,
    sheetHeight,
    drawerTransform,
    panHandlers,
    toggleExpanded,
  } = useBookingDrawerSnap(viewportHeight, insets.top);

  return (
    <Screen>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.page}
      >
        <CustomerMap
          fill
          mode={deliveryMapModeForService(service, routeReady)}
          deliveryService={service}
          pickup={pickup}
          destination={destination}
          routeReady={routeReady}
        />
        <View style={[styles.topBar, { top: Math.max(insets.top, 10) + 4 }]}>
          <IconButton
            label="Go back"
            icon="arrow-left"
            onPress={() => router.back()}
          />
          <View style={styles.servicePill}>
            <View style={styles.serviceDot} />
            <Text style={styles.serviceText}>{serviceLabel}</Text>
          </View>
          <View style={styles.topSpacer} />
        </View>
        <View style={[styles.sheet, { height: sheetHeight }, drawerTransform]}>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel={`${expanded ? "Collapse" : "Expand"} ${stepLabel} drawer`}
            accessibilityHint="You can also drag this handle"
            onPress={toggleExpanded}
            activeOpacity={0.8}
            {...panHandlers}
            style={styles.handleArea}
          >
            <View style={styles.grabber} />
          </TouchableOpacity>
          <View style={styles.heading}>
            <View style={styles.stepPill}>
              <Text style={styles.stepPosition}>{stepPosition}</Text>
              <Text style={styles.stepLabel}>{stepLabel}</Text>
            </View>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.detail}>{detail}</Text>
          </View>
          <ScrollView
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.body}
          >
            {children}
          </ScrollView>
          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, 16) },
            ]}
          >
            {footer}
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, backgroundColor: "#EAF0F1" },
  topBar: {
    position: "absolute",
    zIndex: 3,
    left: 18,
    right: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  servicePill: {
    minHeight: 40,
    paddingHorizontal: 13,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: "rgba(255,255,255,0.96)",
  },
  serviceDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
    backgroundColor: nwcColors.primary,
  },
  serviceText: {
    color: nwcColors.brandNavy,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "Poppins_800ExtraBold",
  },
  topSpacer: { width: 44, height: 44 },
  sheet: {
    position: "absolute",
    zIndex: 5,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: "hidden",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: nwcColors.background,
    shadowColor: "#012642",
    shadowOffset: { width: 0, height: -7 },
    shadowOpacity: 0.17,
    shadowRadius: 18,
    elevation: 14,
  },
  handleArea: { minHeight: 28, alignItems: "center", justifyContent: "center" },
  grabber: {
    width: 46,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#B8C6CC",
  },
  heading: { paddingHorizontal: 20, paddingBottom: 10, gap: 3 },
  stepPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginBottom: 2,
  },
  stepPosition: {
    color: nwcColors.info,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: "Poppins_800ExtraBold",
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  stepLabel: {
    color: nwcColors.brandNavy,
    fontSize: 10,
    lineHeight: 14,
    fontFamily: "Poppins_700Bold",
  },
  title: {
    color: nwcColors.foreground,
    fontSize: 24,
    lineHeight: 30,
    fontFamily: "Poppins_800ExtraBold",
    letterSpacing: -0.35,
  },
  detail: {
    color: nwcColors.muted,
    fontSize: 12,
    lineHeight: 17,
    fontFamily: "Poppins_500Medium",
  },
  body: { gap: 16, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 22 },
  footer: {
    gap: 9,
    paddingHorizontal: 20,
    paddingTop: 11,
    borderTopWidth: 1,
    borderTopColor: nwcColors.border,
    backgroundColor: nwcColors.surfaceElevated,
  },
});
