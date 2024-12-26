import styles from '@/styles/style';
import { router } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { Divider, List, TextInput } from 'react-native-paper';

const Setting = () => {
  const [text, setText] = React.useState("");

  return (
    <View style={[styles["px-4"], styles["mt-4"]]} >
      <TextInput
        mode="outlined"
        label="host"
        placeholder="host"
        left={<TextInput.Icon icon="plus" />}
        right={<TextInput.Icon icon="content-save" />}
      />
      <Divider />
      <List.Section>
        <List.Item
          title="brain"
          left={() => <List.Icon icon="head-cog" />}
          onPress={() => {
            router.push("/setting/assistant")
          }}
        />
        <List.Item
          title="interface"
          left={() => <List.Icon icon="card-outline" />}
          onPress={() => {
            router.push("/setting/interface")

          }}
        />
        <List.Item
          title="headphones"
          left={() => <List.Icon icon="headphones" />}
          onPress={() => {
            router.push("/setting/export")
          }}
        />
        <List.Item
          title="export"
          left={() => <List.Icon icon="share-variant" />}
          onPress={() => {
            router.push("/setting/about")
          }}
        />
        <List.Item
          title="about"
          left={() => <List.Icon icon="help-circle" />}
          onPress={() => {
            router.push("/setting/assistant")

          }}
        />
      </List.Section>
    </View>
  );
};

export default Setting;