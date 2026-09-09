import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ChoiceTile } from "@/components/booking/booking-ui";
import { CustomerBottomDrawer } from "@/components/ui/customer-bottom-drawer";
import { PrimaryButton, SecondaryButton } from "@/components/ui/nwc-ui";
import { quickEditDrawerSnap, type BookingQuickEditChoice } from "@/lib/booking-review-edits";

type BookingQuickEditDrawerProps<T extends string> = {
  visible: boolean;
  overline: string;
  title: string;
  detail: string;
  value: T;
  choices: readonly BookingQuickEditChoice<T>[];
  approveLabel: string;
  onDismiss: () => void;
  onApprove: (value: T) => void;
};

export function BookingQuickEditDrawer<T extends string>({ visible, overline, title, detail, value, choices, approveLabel, onDismiss, onApprove }: BookingQuickEditDrawerProps<T>) {
  const [draftValue, setDraftValue] = useState<T>(value);
  useEffect(() => { if (visible) setDraftValue(value); }, [value, visible]);
  return <CustomerBottomDrawer visible={visible} overline={overline} title={title} detail={detail} initialSnap={quickEditDrawerSnap(choices.length)} onDismiss={onDismiss} footer={<View style={styles.footer}><SecondaryButton label="Cancel" onPress={onDismiss} style={styles.action} /><PrimaryButton label={approveLabel} icon="check" onPress={() => onApprove(draftValue)} style={styles.action} /></View>}><View style={styles.options}>{choices.map((choice) => <ChoiceTile key={choice.id} title={choice.title} detail={choice.detail} icon={choice.icon} selected={draftValue === choice.id} onPress={() => setDraftValue(choice.id)} />)}</View></CustomerBottomDrawer>;
}

const styles = StyleSheet.create({ footer: { flexDirection: "row", gap: 9 }, action: { flex: 1 }, options: { gap: 10 } });
