import styles from '@/styles/style';
import * as React from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';

export default () => {

  return (
    <View style={[styles["px-4"], styles["mt-4"]]} >
      <List.Section>
        <List.Item
          title="upload"
          left={() => <List.Icon icon="upload" />}
          onPress={() => {
          }}
        />
        <List.Item
          title="download"
          left={() => <List.Icon icon="download" />}
          onPress={() => {
          }}
        />
      </List.Section>
    </View>
  );
};