import { useConfigStore } from '@/store/useConfig';
import styles from '@/styles/style';
import { View } from 'react-native';
import { TextInput, Switch, List, Divider } from 'react-native-paper';
import { i18n } from '@/util/l10n/i18n';

export default () => {
  const { config: { noMarkdown, useSystem, systemPrompt }, setConfig } = useConfigStore()

  return (
    <View style={[styles["px-4"], styles["mt-4"]]} >
      <TextInput
        mode="outlined"
        multiline
        style={{ height: 100 }}
        label={i18n.t("settingsSystemMessage")}
        onChangeText={(text) => setConfig({ systemPrompt: text })}
        value={systemPrompt}
        textAlignVertical='top'
      />
      <List.Section>
        <List.Item
          title={i18n.t("settingsUseSystem")}
          right={(props) => <Switch {...props} value={useSystem} onValueChange={(useSystem) => setConfig({ useSystem })} />}
        />
        <Divider />
        <List.Item
          title={i18n.t("settingsDisableMarkdown")}
          right={(props) => <Switch {...props} value={noMarkdown} onValueChange={(noMarkdown) => setConfig({ noMarkdown })} />}
        />
      </List.Section>
    </View>
  );
};