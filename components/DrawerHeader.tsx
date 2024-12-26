import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

function DrawerHeader() {
  return (
    <View style={styles.header}>
      <Image
        source={require('../assets/images/logo.png')} 
        style={styles.image}
      />
      <Text>Ollama</Text>
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
  },
  image: {
    height: 30,
    width: 23,
  },
});

export default DrawerHeader;