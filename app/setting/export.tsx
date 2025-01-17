import styles from '@/styles/style';
import * as React from 'react';
import { View } from 'react-native';
import { List } from 'react-native-paper';
import { i18n } from '@/util/l10n/i18n';

export default () => {

  return (
    <View style={[styles["px-4"], styles["mt-4"]]} >
      <List.Section>
        <List.Item
          title={i18n.t("settingsImportChats")}
          left={() => <List.Icon icon="upload" />}
          onPress={() => {
          }}
        />
        <List.Item
          title={i18n.t("settingsExportChats")}
          left={() => <List.Icon icon="download" />}
          onPress={() => {
          }}
        />
      </List.Section>
    </View>
  );
};