import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAppTheme } from './ThemeProvider';
import SVGImg from "@/assets/logo.svg";

function DrawerHeader() {
  const { colors: { onBackground } } = useAppTheme()

  return (
    <View style={styles.header}>
      <SVGImg width={23} height={30} fill={onBackground} />
      <Text style={{ color: onBackground }}>Ollama</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  header: {
    paddingInline: 16,
    height: 48,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  }
});

export default DrawerHeader;