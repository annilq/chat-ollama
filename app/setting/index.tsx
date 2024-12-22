import ListItem from '@/components/ListItem';
import { router } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Divider, Text, TextInput } from 'react-native-paper';

const Setting = () => {
  const [text, setText] = React.useState("");

  return (
    <View>
      <TextInput
        mode="outlined"
        label="主机地址"
        placeholder="Type something"
        right={<TextInput.Affix text="/100" />}
        left={<TextInput.Affix text="/100" />}
      />
      <Divider />
      <ListItem title="titleLarge" onPress={() => {
        router.push("/setting/assistant")

      }} />
      <Divider />
      <ListItem title="titleLarge" onPress={() => {
        router.push("/setting/interface")

      }} />
      <Divider />
      <ListItem title="titleLarge" onPress={() => {
        router.push("/setting/export")

      }} />
      <Divider />
      <ListItem title="titleLarge" onPress={() => {
        router.push("/setting/about")

      }} />
      <Divider />
      <ListItem title="titleLarge" onPress={() => {
        router.push("/setting/assistant")

      }} />
      <Divider />
      <ListItem title="titleLarge" onPress={() => {
        router.push("/setting/assistant")

      }} />
      <Divider />
    </View>
  );
};

export default Setting;