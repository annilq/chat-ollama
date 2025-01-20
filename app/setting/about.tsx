import * as React from 'react';
import { Linking, View } from 'react-native';
import { List } from 'react-native-paper';
import * as Application from 'expo-application';

import styles from '@/styles/style';
import Divider from '@/components/Divider';
import SVGImg from "@/assets/logo.svg";
import { useAppTheme } from '@/components/ThemeProvider';
import { i18n } from '@/util/l10n/i18n';

export default () => {
  const { colors: { onBackground } } = useAppTheme()

  return (
    <View style={[styles["px-4"], styles["mt-4"]]} >
      <List.Section>
        <List.Item
          title={i18n.t("settingsVersion", { version: Application.nativeApplicationVersion })}
          left={() => <SVGImg width={23} height={30} fill={onBackground} />}
        />
        <Divider />
        <List.Item
          title="github"
          left={() => <List.Icon icon="github" />}
          onPress={() => {
            Linking.openURL('https://github.com/annilq/chat-ollama')
          }}
        />
        <List.Item
          title="issue"
          left={() => <List.Icon icon="information" />}
          onPress={() => {
            Linking.openURL('https://github.com/annilq/chat-ollama/issues')
          }}
        />
        {/* <List.Item
          title="license"
          left={() => <List.Icon icon="license" />}
          onPress={() => {
          }}
        /> */}
      </List.Section>
    </View>
  );
};