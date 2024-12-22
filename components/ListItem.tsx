import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

function ListItem(props: {
  title: string,
  onPress: () => void
  icon?: React.ReactNode
}) {
  return (
    <TouchableOpacity onPress={props.onPress}>
      <View style={styles.header} >
        {props.icon}
        <Text variant="titleLarge">{props.title}</Text>
      </View>
    </TouchableOpacity>
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
});

export default ListItem;