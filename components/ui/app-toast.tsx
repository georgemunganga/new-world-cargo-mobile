import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type PropsWithChildren,
} from "react";
import { Animated, Pressable, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppNotice, type AppNoticeTone } from "@/components/ui/nwc-ui";

export type AppToastOptions = {
  duration?: number;
  tone?: AppNoticeTone;
};

type ToastItem = {
  id: number;
  message: string;
  duration: number;
  tone: AppNoticeTone;
};

export type AppToastApi = {
  dismiss: () => void;
  error: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
  show: (message: string, options?: AppToastOptions) => void;
  success: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
};

const DEFAULT_DURATION = 3500;
const AppToastContext = createContext<AppToastApi | null>(null);

export function AppToastProvider({ children }: PropsWithChildren) {
  const insets = useSafeAreaInsets();
  const [toast, setToast] = useState<ToastItem | null>(null);
  const nextId = useRef(0);
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-12)).current;

  const dismiss = useCallback(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: -12, duration: 160, useNativeDriver: true }),
    ]).start(() => setToast(null));
  }, [opacity, translateY]);

  const show = useCallback((message: string, options: AppToastOptions = {}) => {
    const cleanMessage = message.trim();
    if (!cleanMessage) return;
    nextId.current += 1;
    setToast({
      id: nextId.current,
      message: cleanMessage,
      duration: options.duration ?? DEFAULT_DURATION,
      tone: options.tone ?? "info",
    });
  }, []);

  useEffect(() => {
    if (!toast) return;
    opacity.setValue(0);
    translateY.setValue(-12);
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 190, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, damping: 18, stiffness: 220, mass: 0.8, useNativeDriver: true }),
    ]).start();
    const timer = setTimeout(dismiss, toast.duration);
    return () => clearTimeout(timer);
  }, [dismiss, opacity, toast, translateY]);

  const api = useMemo<AppToastApi>(() => ({
    dismiss,
    show,
    info: (message, duration) => show(message, { duration, tone: "info" }),
    success: (message, duration) => show(message, { duration, tone: "success" }),
    warning: (message, duration) => show(message, { duration, tone: "warning" }),
    error: (message, duration) => show(message, { duration, tone: "error" }),
  }), [dismiss, show]);

  return (
    <AppToastContext.Provider value={api}>
      {children}
      <View pointerEvents="box-none" style={[styles.viewport, { top: insets.top + 24 }]}>
        {toast ? (
          <Animated.View
            key={toast.id}
            accessibilityLiveRegion="polite"
            style={[styles.animatedToast, { opacity, transform: [{ translateY }] }]}
          >
            <Pressable accessibilityRole="button" accessibilityLabel="Dismiss notification" onPress={dismiss}>
              <AppNotice message={toast.message} tone={toast.tone} style={styles.notice} textStyle={styles.noticeText} />
            </Pressable>
          </Animated.View>
        ) : null}
      </View>
    </AppToastContext.Provider>
  );
}

export function useAppToast() {
  const context = useContext(AppToastContext);
  if (!context) throw new Error("useAppToast must be used within AppToastProvider");
  return context;
}

const styles = StyleSheet.create({
  viewport: {
    position: "absolute",
    left: 16,
    right: 16,
    zIndex: 2000,
    elevation: 20,
  },
  animatedToast: {
    width: "100%",
    maxWidth: 520,
    alignSelf: "center",
  },
  notice: {
    minHeight: 58,
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  noticeText: {
    fontSize: 13,
    lineHeight: 19,
  },
});
