import styles from '@/styles/style';
import { router } from 'expo-router';
import * as React from 'react';
import { View } from 'react-native';
import { List, TextInput } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';

const Setting = () => {
  const [text, setText] = React.useState("");

  return (
    <View style={[styles["px-4"],styles["mt-4"]]}>
      <TextInput
        mode="outlined"
        label="主机地址"
        placeholder="host"
        left={<TextInput.Icon icon="plus" />}
        right={<TextInput.Icon icon="content-save" />}

      />
      <List.Section>
        <List.Item
          title="First Item"
          left={() => <List.Icon icon="folder" />}
          onPress={() => {
            router.push("/setting/assistant")
          }}
        />
        <List.Item
          title="First Item"
          left={() => <List.Icon icon="folder" />}
          onPress={() => {
            router.push("/setting/interface")

          }}
        />
        <List.Item
          title="First Item"
          left={() => <List.Icon icon="folder" />}
          onPress={() => {
            router.push("/setting/export")

          }}
        />
        <List.Item
          title="First Item"
          left={() => <List.Icon icon="folder" />}
          onPress={() => {
            router.push("/setting/about")

          }}
        />
        <List.Item
          title="First Item"
          left={() => <List.Icon icon="folder" />}
          onPress={() => {
            router.push("/setting/assistant")

          }}
        />
      </List.Section>
    </View>
  );
};

export default Setting;