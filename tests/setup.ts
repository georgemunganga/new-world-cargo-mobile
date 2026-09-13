import { vi } from "vitest";

vi.stubGlobal("__DEV__", false);

vi.mock("react-native", () => ({
  Linking: {
    addEventListener: vi.fn(() => ({ remove: vi.fn() })),
    canOpenURL: vi.fn(async () => false),
    getInitialURL: vi.fn(async () => null),
    openURL: vi.fn(async () => undefined),
  },
  NativeModules: {},
  Platform: { OS: "web", select: (values: Record<string, unknown>) => values.web ?? values.default },
}));

vi.mock("expo-constants", () => ({
  default: {
    expoConfig: { extra: {} },
    easConfig: {},
  },
}));

vi.mock("expo-modules-core", () => ({
  EventEmitter: class {},
  NativeModule: class {},
  requireNativeModule: vi.fn(() => ({})),
  requireOptionalNativeModule: vi.fn(() => null),
  Platform: { OS: "web", select: (values: Record<string, unknown>) => values.web ?? values.default },
}));

vi.mock("expo-secure-store", () => ({
  getItemAsync: vi.fn(async () => null),
  setItemAsync: vi.fn(async () => undefined),
  deleteItemAsync: vi.fn(async () => undefined),
}));

vi.mock("expo-document-picker", () => ({
  getDocumentAsync: vi.fn(async () => ({ canceled: true, assets: [] })),
}));

vi.mock("expo-image-picker", () => ({
  MediaTypeOptions: { Images: "Images" },
  requestMediaLibraryPermissionsAsync: vi.fn(async () => ({ granted: false })),
  launchImageLibraryAsync: vi.fn(async () => ({ canceled: true, assets: [] })),
}));
