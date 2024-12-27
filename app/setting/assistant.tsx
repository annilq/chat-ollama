import styles from '@/styles/style';
import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { Divider, TextInput, Switch, List } from 'react-native-paper';

export default () => {
  const [value, setValue] = useState("You are a helpful assistant")
  const [isSystemHelpSwitchOn, setIsSystemHelpSwitchOn] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  return (
    <View style={[styles["px-4"], styles["mt-4"]]} >
      <TextInput
        mode="outlined"
        multiline
        style={{ height: 100 }}
        label="behavior"
        onChangeText={setValue}
        value={value}
        textAlignVertical='top'
        right={<TextInput.Icon icon="content-save" />}
      />
      <Divider />
      <List.Section>
        <List.Item
          title="Use system help"
          right={(props) => <Switch {...props} value={isSystemHelpSwitchOn} onValueChange={setIsSystemHelpSwitchOn} />}
        />
        <List.Item
          title="disable markDown"
          right={(props) => <Switch {...props} value={isSwitchOn} onValueChange={onToggleSwitch} />}
        />
      </List.Section>
    </View>
  );
};