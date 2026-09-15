import { mobileInputStyles , MobileInput } from "@/components/ui/mobile-input";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

import { CustomerMap } from "@/components/map/customer-map";
import { CustomerBottomDrawer } from "@/components/ui/customer-bottom-drawer";
import { AppIcon } from "@/components/ui/app-icon";
import { PrimaryButton, SecondaryButton } from "@/components/ui/nwc-ui";
import type { AddressBookItem } from "@/lib/domain/address-book";
import { loadRouteReferenceData, resolveRouteSuggestion, routeSuggestionToAddress, searchLiveRouteSuggestions, searchRouteSuggestions, type RouteSuggestion } from "@/lib/route-autocomplete";
import { nwcColors } from "@/lib/nwc-theme";

type LocationFinderDrawerProps = { visible: boolean; item: AddressBookItem | null; onDismiss: () => void; onSave: (item: Omit<AddressBookItem, "id"> & { id?: string }) => void };

export function LocationFinderDrawer({ visible, item, onDismiss, onSave }: LocationFinderDrawerProps) {
  const [label, setLabel] = useState("");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<RouteSuggestion | null>(null);
  const [suggestions, setSuggestions] = useState<RouteSuggestion[]>([]);
  useEffect(() => { if (visible) { setLabel(item?.label ?? ""); setQuery(item?.detail ?? ""); setSelected(null); } }, [item, visible]);
  const [referenceVersion, setReferenceVersion] = useState(0);
  useEffect(() => {
    if (!visible) return;
    let mounted = true;
    void loadRouteReferenceData().then(() => {
      if (mounted) setReferenceVersion((value) => value + 1);
    });
    return () => {
      mounted = false;
    };
  }, [visible]);
  useEffect(() => {
    let mounted = true;
    if (!visible) return () => { mounted = false; };
    setSuggestions(searchRouteSuggestions("local", query));
    if (query.trim().length < 3) return () => { mounted = false; };
    const timer = setTimeout(() => {
      void searchLiveRouteSuggestions("local", query).then((records) => { if (mounted) setSuggestions(records); }).catch(() => undefined);
    }, 300);
    return () => { mounted = false; clearTimeout(timer); };
  }, [query, referenceVersion, visible]);
  const selectedAddress = selected ? routeSuggestionToAddress(selected) : undefined;
  const save = () => { if (!label.trim() || !query.trim()) return; onSave({ id: item?.id || undefined, label: label.trim(), detail: selected?.detail ?? query.trim(), city: selected?.city, area: selected?.area, country: selected?.country, latitude: selected?.latitude, longitude: selected?.longitude }); };
  return <CustomerBottomDrawer visible={visible} overline="Saved place" title={item?.id ? "Edit saved place" : "Find a place"} detail="Search nearby locations, inspect the map, then save a name you will recognize." initialSnap="expanded" onDismiss={onDismiss} footer={<View style={styles.actions}><SecondaryButton label="Cancel" onPress={onDismiss} style={styles.action} /><PrimaryButton label="Save place" icon="check" disabled={!label.trim() || !query.trim() || !selected} onPress={save} style={styles.action} /></View>}><CustomerMap mode="location-picker" destination={selectedAddress} height={144} style={styles.map} /><MobileInput label="Place name (Home, Work...)" value={label} onChangeText={setLabel} returnKeyType="next" /><View style={[styles.search, mobileInputStyles.frame]}><AppIcon name="magnify" size={19} color={nwcColors.info} /><TextInput accessibilityLabel="Find a nearby location" value={query} onChangeText={(value) => { setQuery(value); setSelected(null); }} placeholder="Find a nearby location" placeholderTextColor="#91A0AE" returnKeyType="search" style={[styles.searchInput, mobileInputStyles.text]} /></View><View style={styles.results}>{suggestions.map((suggestion) => <View key={suggestion.id} style={styles.result}><View style={styles.resultIcon}><AppIcon name={suggestion.kind === "branch" ? "warehouse" : "map-marker-outline"} size={18} color={nwcColors.brandNavy} /></View><View style={styles.resultCopy}><View style={styles.resultLabelRow}><PrimaryButton label={suggestion.label} icon={selected?.id === suggestion.id ? "check" : undefined} onPress={() => { void resolveRouteSuggestion(suggestion).then((resolved) => { setSelected(resolved); setQuery(resolved.label); }); }} style={styles.useAction} /></View></View></View>)}</View></CustomerBottomDrawer>;
}

const styles = StyleSheet.create({
  map: { borderRadius: 20 }, input: { minHeight: 50, paddingHorizontal: 13, borderRadius: 15, borderWidth: 1, borderColor: "#DCE6E8", backgroundColor: nwcColors.surfaceElevated, color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_600SemiBold" }, search: { minHeight: 50, paddingHorizontal: 13, borderRadius: 15, borderWidth: 1, borderColor: "#DCE6E8", backgroundColor: nwcColors.surfaceElevated, flexDirection: "row", alignItems: "center", gap: 8 }, searchInput: { flex: 1, color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_600SemiBold" }, results: { gap: 7 }, result: { minHeight: 53, borderRadius: 15, paddingLeft: 9, paddingRight: 7, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: nwcColors.surface }, resultIcon: { width: 35, height: 35, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.surfaceNavyTint }, resultCopy: { flex: 1 }, resultLabelRow: { flex: 1 }, useAction: { minHeight: 39, borderRadius: 13 }, actions: { flexDirection: "row", gap: 9 }, action: { flex: 1 },
});
