import { defaultTheme } from "@flyerhq/react-native-chat-ui";
import { MD3DarkTheme, MD3LightTheme } from "react-native-paper";

export const colors = {
  light: {
    background: "#FFFFFF",
    surface: "#FFFFFF",
    primary: "#000000",
    secondary: "#1E1E1E",
    text: "#000000",
    textSecondary: "#6E6E6E",
    outline: "#000000",
    inputBackground: "#F5F5F5",
  },
  dark: {
    background: MD3DarkTheme.colors.background,
    surface: "#2C2C2C",
    primary: "#FFFFFF",
    secondary: "#E0E0E0",
    text: "#FFFFFF",
    textSecondary: "#ADADAD",
    outline: "#FFFFFF",
    inputBackground: "#2C2C2C",
  },
};

// React Native Paper 
export const PaperLightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: colors.light.primary,
    secondary: colors.light.secondary,
    onSurface: colors.light.text,
    onBackground: colors.light.text,
    outline: colors.light.outline,
  },
  fonts: {
    ...MD3LightTheme.fonts,
  },
};

export const PaperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: colors.dark.primary,
    secondary: colors.dark.secondary,
    onSurface: colors.dark.text,
    onBackground: colors.dark.text,
    outline: colors.dark.outline,
  },
  fonts: {
    ...MD3DarkTheme.fonts,
  },
};

// Chat UI 
export const ChatLightTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    background: colors.light.background,
    primary: colors.light.primary,
    secondary: colors.light.secondary,
    inputText: colors.light.text,
    inputBackground: colors.light.inputBackground,
    error: "#FF3B30",
    modalBackground: colors.light.surface,
  },
};

export const ChatDarkTheme = {
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    background: colors.dark.background,
    primary: colors.dark.primary,
    secondary: colors.dark.secondary,
    inputText: colors.dark.text,
    inputBackground: colors.dark.inputBackground,
    error: "#FF453A",
    modalBackground: colors.dark.surface,
  },
};