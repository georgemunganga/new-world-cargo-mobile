import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";
import { MapSkeleton } from "@/components/ui/skeleton";
import { nwcColors } from "@/lib/nwc-theme";

export function MapLoadingOverlay({ ready, onRetry }: { ready: boolean; onRetry: () => void }) {
  const opacity = useRef(new Animated.Value(1)).current;
  const [visible, setVisible] = useState(true);
  const [slow, setSlow] = useState(false);
  useEffect(() => {
    if (ready) {
      setSlow(false);
      const animation = Animated.timing(opacity, {toValue:0, duration:250, useNativeDriver:true});
      animation.start(({finished}) => {if(finished) setVisible(false);});
      return () => animation.stop();
    }
    const timer = setTimeout(() => setSlow(true), 15000);
    return () => clearTimeout(timer);
  }, [ready, opacity]);
  if (slow) return <TouchableOpacity accessibilityRole="button" accessibilityLabel="Retry map loading" onPress={onRetry} style={styles.retry}><Text style={{color:nwcColors.brandNavy}}>Map could not load. Tap to retry.</Text></TouchableOpacity>;
  if (!visible) return null;
  return <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, {opacity}]}><MapSkeleton fill /></Animated.View>;
}
const styles = StyleSheet.create({retry:{...StyleSheet.absoluteFillObject, backgroundColor:"#EEF2F2",alignItems:"center",justifyContent:"center",padding:20}});
