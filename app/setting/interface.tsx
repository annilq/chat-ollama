import styles from '@/styles/style';
import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { Switch, List, SegmentedButtons } from 'react-native-paper';
import Divider from '@/components/Divider';

export default () => {
  const [isSystemHelpSwitchOn, setIsSystemHelpSwitchOn] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const [value, setValue] = useState("stream");

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);

  return (
    <View style={[styles["px-4"], styles["mt-4"]]} >
      <List.Section>
        <List.Item
          title="show model tags"
          right={(props) => <Switch {...props} value={isSystemHelpSwitchOn} onValueChange={setIsSystemHelpSwitchOn} />}
        />
        <List.Item
          title="preload model"
          right={(props) => <Switch {...props} value={isSwitchOn} onValueChange={onToggleSwitch} />}
        />

        <List.Item
          title="reset when model change"
          right={(props) => <Switch {...props} value={isSystemHelpSwitchOn} onValueChange={setIsSystemHelpSwitchOn} />}
        />

        <Divider  />

        <SegmentedButtons
          value={value}
          onValueChange={setValue}
          buttons={[
            {
              value: 'stream',
              label: 'stream',
            },
            {
              value: 'generate',
              label: 'generate',
            },
          ]}
        />
        <List.Item
          title="generate title"
          right={(props) => <Switch {...props} value={isSwitchOn} onValueChange={onToggleSwitch} />}
        />
        <List.Item
          title="enable message edit"
          right={(props) => <Switch {...props} value={isSystemHelpSwitchOn} onValueChange={setIsSystemHelpSwitchOn} />}
        />
        <List.Item
          title="enable delete message promote"
          right={(props) => <Switch {...props} value={isSwitchOn} onValueChange={onToggleSwitch} />}
        />
        <List.Item
          title="show tip in sidebar"
          right={(props) => <Switch {...props} value={isSystemHelpSwitchOn} onValueChange={setIsSystemHelpSwitchOn} />}
        />

        <Divider  />

        <List.Item
          title="always keep preload model"
          right={(props) => <Switch {...props} value={isSwitchOn} onValueChange={onToggleSwitch} />}
        />
        <List.Item
          title="do not keep preload model"
          right={(props) => <Switch {...props} value={isSwitchOn} onValueChange={onToggleSwitch} />}
        />
      </List.Section>
    </View>
  );
};