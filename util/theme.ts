import { defaultTheme } from "@flyerhq/react-native-chat-ui";
import { DefaultTheme, MD3DarkTheme, MD3LightTheme } from "react-native-paper";

// 
const colors = {
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
    background: "#1E1E1E",
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
    background: colors.light.background,
    surface: colors.light.surface,
    primary: colors.light.primary,
    secondary: colors.light.secondary,
    onSurface: colors.light.text,
    onBackground: colors.light.text,
    outline: colors.light.outline,
    elevation: {
      level0: "transparent",
      level1: colors.light.surface,
      level2: colors.light.surface,
      level3: colors.light.surface,
      level4: colors.light.surface,
      level5: colors.light.surface,
    },
  },
  fonts: {
    ...MD3LightTheme.fonts,
    // 可以在这里自定义字体设置
  },
};

export const PaperDarkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    background: colors.dark.background,
    surface: colors.dark.surface,
    primary: colors.dark.primary,
    secondary: colors.dark.secondary,
    onSurface: colors.dark.text,
    onBackground: colors.dark.text,
    outline: colors.dark.outline,
    elevation: {
      level0: "transparent",
      level1: colors.dark.surface,
      level2: colors.dark.surface,
      level3: colors.dark.surface,
      level4: colors.dark.surface,
      level5: colors.dark.surface,
    },
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