import styles from '@/styles/style';
import * as React from 'react';
import { View } from 'react-native';
import { Divider, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default () => {

  return (
    <View style={[styles["px-4"], styles["mt-4"]]} >
      <List.Section>
        <List.Item
          title="Ollama App"
          left={() => <Icon name="verified" size={24} />}
          onPress={() => {
          }}
        />
        <Divider style={{ marginVertical: 20 }} />
        <List.Item
          title="github"
          left={() => <List.Icon icon="github" />}
          onPress={() => {
          }}
        />
        <List.Item
          title="issue"
          left={() => <List.Icon icon="information" />}
          onPress={() => {
          }}
        />
        <List.Item
          title="license"
          left={() => <List.Icon icon="license" />}
          onPress={() => {
          }}
        />
      </List.Section>
    </View>
  );
};