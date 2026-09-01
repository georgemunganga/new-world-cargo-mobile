import { useMemo, useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { AppIcon, type AppIconName } from "@/components/ui/app-icon";
import { searchRouteSuggestions, type RouteSearchScope, type RouteSuggestion } from "@/lib/route-autocomplete";
import { nwcColors } from "@/lib/nwc-theme";

type RoutePoint = { value: string; detail: string };
type RouteTarget = "from" | "to";

export function RouteEntryCard({ from, to, scope, onSuggestionSelect, onManualEntryPress, accessibilityHint, fromLabel = "From where?", toLabel = "To where?" }: { from: RoutePoint; to: RoutePoint; scope: RouteSearchScope; onSuggestionSelect: (target: RouteTarget, suggestion: RouteSuggestion) => void; onManualEntryPress?: () => void; accessibilityHint?: string; fromLabel?: string; toLabel?: string }) {
  const [active, setActive] = useState<RouteTarget | null>(null);
  const [query, setQuery] = useState("");
  const results = useMemo(() => active ? searchRouteSuggestions(scope, query) : [], [active, query, scope]);
  const open = (target: RouteTarget) => { setActive(target); setQuery(""); };
  const select = (suggestion: RouteSuggestion) => { if (!active) return; const next = active === "from" ? "to" : null; onSuggestionSelect(active, suggestion); setQuery(""); setActive(next); };
  return <View accessibilityLabel={accessibilityHint} style={styles.card}><RouteField target="from" label={fromLabel} point={from} active={active === "from"} query={query} scope={scope} results={results} onOpen={() => open("from")} onChangeText={setQuery} onSelect={select} onManualEntryPress={onManualEntryPress} /><View style={styles.divider} /><RouteField target="to" label={toLabel} point={to} active={active === "to"} query={query} scope={scope} results={results} onOpen={() => open("to")} onChangeText={setQuery} onSelect={select} onManualEntryPress={onManualEntryPress} /></View>;
}

function RouteField({ target, label, point, active, query, scope, results, onOpen, onChangeText, onSelect, onManualEntryPress }: { target: RouteTarget; label: string; point: RoutePoint; active: boolean; query: string; scope: RouteSearchScope; results: RouteSuggestion[]; onOpen: () => void; onChangeText: (value: string) => void; onSelect: (suggestion: RouteSuggestion) => void; onManualEntryPress?: () => void }) {
  const isFrom = target === "from";
  const icon: AppIconName = isFrom ? "circle-outline" : "map-marker";
  const placeholder = isFrom ? "Add pickup" : "Add destination";
  return <View style={[styles.fieldBlock, active && styles.fieldBlockActive]}><TouchableOpacity accessibilityRole="button" accessibilityLabel={`${label} ${point.value || placeholder}`} accessibilityHint="Type to see location suggestions below this field" activeOpacity={0.78} onPress={onOpen} style={styles.row}><View style={isFrom ? styles.routeIconFrom : styles.routeIconTo}><AppIcon name={icon} size={20} color={isFrom ? nwcColors.brandNavy : nwcColors.primaryInk} /></View><View style={styles.copy}><Text style={styles.label}>{label}</Text>{active ? <TextInput autoFocus value={query} onChangeText={onChangeText} placeholder={scope === "import" ? "Search country, city, port, or airport" : scope === "intercity" ? "Search city or cargo branch" : "Search area, landmark, or branch"} placeholderTextColor="#8A9AA7" style={styles.searchInput} returnKeyType="search" /> : <><Text numberOfLines={1} style={[styles.value, !point.value && styles.placeholder]}>{point.value || placeholder}</Text>{point.detail ? <Text numberOfLines={1} style={styles.detail}>{point.detail}</Text> : null}</>}</View><AppIcon name={active ? "close" : "magnify"} size={20} color={nwcColors.muted} /></TouchableOpacity>{active ? <View style={styles.suggestions}>{results.map((suggestion) => <SuggestionRow key={suggestion.id} suggestion={suggestion} onPress={() => onSelect(suggestion)} />)}{results.length === 0 ? <View style={styles.emptySuggestion}><AppIcon name="map-search-outline" size={18} color={nwcColors.info} /><Text style={styles.emptySuggestionText}>No {scope === "import" ? "supplier city, port, or airport" : "matching place"} in this preview.</Text></View> : null}{onManualEntryPress ? <TouchableOpacity accessibilityRole="button" accessibilityLabel="Enter location manually" onPress={onManualEntryPress} style={styles.manualRow}><AppIcon name="pencil-outline" size={17} color={nwcColors.info} /><Text style={styles.manualText}>Enter a location manually</Text></TouchableOpacity> : null}</View> : null}</View>;
}

function SuggestionRow({ suggestion, onPress }: { suggestion: RouteSuggestion; onPress: () => void }) {
  const icon: AppIconName = suggestion.kind === "branch" ? "storefront-outline" : suggestion.kind === "warehouse" ? "warehouse" : suggestion.kind === "airport" ? "airplane" : suggestion.kind === "port" ? "ferry" : suggestion.kind === "city" ? "city-variant-outline" : "map-marker-outline";
  return <TouchableOpacity accessibilityRole="button" accessibilityLabel={`Select ${suggestion.label}`} accessibilityHint={suggestion.detail} onPress={onPress} activeOpacity={0.72} style={styles.suggestionRow}><View style={styles.suggestionIcon}><AppIcon name={icon} size={17} color={nwcColors.brandNavy} /></View><View style={styles.suggestionCopy}><Text numberOfLines={1} style={styles.suggestionTitle}>{suggestion.label}</Text><Text numberOfLines={1} style={styles.suggestionDetail}>{suggestion.detail}</Text></View></TouchableOpacity>;
}

const styles = StyleSheet.create({
  card: { borderRadius: 24, overflow: "visible", backgroundColor: nwcColors.white, borderWidth: 1, borderColor: "#E4EAED", zIndex: 4 },
  fieldBlock: { position: "relative", zIndex: 1 },
  fieldBlockActive: { zIndex: 5 },
  row: { minHeight: 75, flexDirection: "row", alignItems: "center", paddingHorizontal: 15, gap: 12 },
  routeIconFrom: { width: 43, height: 43, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: "#EDF3F5" },
  routeIconTo: { width: 43, height: 43, borderRadius: 15, alignItems: "center", justifyContent: "center", backgroundColor: nwcColors.primary },
  copy: { flex: 1, gap: 1 },
  label: { color: nwcColors.muted, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_700Bold" },
  value: { color: nwcColors.foreground, fontSize: 16, lineHeight: 22, fontFamily: "Poppins_800ExtraBold" },
  placeholder: { color: nwcColors.muted },
  detail: { color: nwcColors.info, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_600SemiBold" },
  divider: { height: 1, backgroundColor: "#E7ECEE", marginLeft: 70 },
  searchInput: { minHeight: 31, padding: 0, color: nwcColors.foreground, fontSize: 15, lineHeight: 21, fontFamily: "Poppins_700Bold" },
  suggestions: { marginHorizontal: 10, marginTop: -2, marginBottom: 8, backgroundColor: nwcColors.surface, borderWidth: 1, borderColor: "#DDE6E9", borderRadius: 17, overflow: "hidden", shadowColor: "#012642", shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.13, shadowRadius: 14, elevation: 7 },
  suggestionRow: { minHeight: 55, paddingHorizontal: 12, flexDirection: "row", alignItems: "center", gap: 9, borderBottomWidth: 1, borderBottomColor: "#EDF1F2" },
  suggestionIcon: { height: 33, width: 33, borderRadius: 11, alignItems: "center", justifyContent: "center", backgroundColor: "#EDF3F5" },
  suggestionCopy: { flex: 1, gap: 1 },
  suggestionTitle: { color: nwcColors.foreground, fontSize: 13, lineHeight: 18, fontFamily: "Poppins_800ExtraBold" },
  suggestionDetail: { color: nwcColors.muted, fontSize: 11, lineHeight: 15, fontFamily: "Poppins_500Medium" },
  emptySuggestion: { minHeight: 56, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 8 },
  emptySuggestionText: { flex: 1, color: nwcColors.muted, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_600SemiBold" },
  manualRow: { minHeight: 46, paddingHorizontal: 13, flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: "#F1F7F9" },
  manualText: { color: nwcColors.info, fontSize: 12, lineHeight: 17, fontFamily: "Poppins_800ExtraBold" },
});
