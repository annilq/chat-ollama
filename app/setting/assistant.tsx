import { useConfigStore } from '@/store/useConfig';
import styles from '@/styles/style';
import { View } from 'react-native';
import { TextInput, Switch, List, Divider } from 'react-native-paper';

export default () => {
  const { config: { useMarkdown, useSystem, systemPrompt }, setConfig } = useConfigStore()

  return (
    <View style={[styles["px-4"], styles["mt-4"]]} >
      <TextInput
        mode="outlined"
        multiline
        style={{ height: 100 }}
        label="behavior"
        onChangeText={(text) => setConfig({ systemPrompt: text })}
        value={systemPrompt}
        textAlignVertical='top'
      />
      <List.Section>
        <List.Item
          title="Use system help"
          right={(props) => <Switch {...props} value={useSystem} onValueChange={(useSystem) => setConfig({ useSystem })} />}
        />
        <Divider />
        <List.Item
          title="disable markDown"
          right={(props) => <Switch {...props} value={useMarkdown} onValueChange={(useMarkdown) => setConfig({ useMarkdown })} />}
        />
      </List.Section>
    </View>
  );
};