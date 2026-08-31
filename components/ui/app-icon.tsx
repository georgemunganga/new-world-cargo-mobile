import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import type { ComponentProps } from "react";
import type { StyleProp, TextStyle } from "react-native";

export type AppIconName = ComponentProps<typeof MaterialCommunityIcons>["name"];

export function AppIcon({ name, size = 22, color, style }: { name: AppIconName; size?: number; color: string; style?: StyleProp<TextStyle> }) {
  return <MaterialCommunityIcons name={name} size={size} color={color} style={style} />;
}
