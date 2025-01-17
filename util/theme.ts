import { defaultTheme } from "@flyerhq/react-native-chat-ui";
import { DefaultTheme } from "react-native-paper";

// react-native-paper theme
export const PaperDarkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    outline: "#ffffff",
    primary: '#ffffff',
    background: "#000000"
  },
};

export const PaperLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    outline: "#000000",
    primary: '#000000',
    background: "#ffffff"
  },
};


// @flyerhq/react-native-chat-ui theme

export const ChatLightTheme ={
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    primary: "#fff",
    inputText: "#000",
    inputBackground: "#efefef"
  },
}
export const ChatDarkTheme ={
  ...defaultTheme,
  colors: {
    ...defaultTheme.colors,
    // background:"#000",
    primary: "#fff",
    inputText: "#000",
    inputBackground: "#efefef"
  },
}
