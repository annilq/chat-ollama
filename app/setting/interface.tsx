import styles from '@/styles/style';
import * as React from 'react';
import { useState } from 'react';
import { View } from 'react-native';
import { Switch, List, SegmentedButtons } from 'react-native-paper';
import Divider from '@/components/Divider';
import { RequestType, useConfigStore } from '@/store/useConfig';

export default () => {
  const { config: { showModelTag, showTipsInDrawer, clearChatWhenResetModel, requestType, generateTitles, messageEditable, showConfirmWhenChatDelete, }, setConfig } = useConfigStore()

  return (
    <View style={[styles["px-4"], styles["mt-4"]]} >
      <List.Section>
        <List.Item
          title="show model tags"
          right={(props) => <Switch {...props} value={showModelTag} onValueChange={(value) => setConfig({ showModelTag: value })} />}
        />
        {/* <List.Item
          title="preload model"
          right={(props) => <Switch {...props} value={isSwitchOn} onValueChange={(value)=>setConfig({showModelTag:value})} />}
        /> */}

        <List.Item
          title="reset when model change"
          right={(props) => <Switch {...props} value={clearChatWhenResetModel} onValueChange={(value) => setConfig({ clearChatWhenResetModel: value })} />}
        />

        <Divider />

        <SegmentedButtons
          value={requestType}
          onValueChange={(value) => setConfig({ requestType: value as RequestType })}
          buttons={[
            {
              value: 'stream',
              disabled: true,
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
          right={(props) => <Switch {...props} value={generateTitles} onValueChange={(value) => setConfig({ generateTitles: value })} />}
        />
        <List.Item
          title="enable message editable"
          right={(props) => <Switch {...props} value={messageEditable} onValueChange={(value) => setConfig({ messageEditable: value })} />}
        />
        <List.Item
          title="confirm when delete message"
          right={(props) => <Switch {...props} value={showConfirmWhenChatDelete} onValueChange={(value) => setConfig({ showConfirmWhenChatDelete: value })} />}
        />
        <List.Item
          title="show tip in sidebar"
          right={(props) => <Switch {...props} value={showTipsInDrawer} onValueChange={(value) => setConfig({ showTipsInDrawer: value })} />}
        />

        {/* <Divider />
        <List.Item
          title="always keep preload model"
          right={(props) => <Switch {...props} value={isSwitchOn} onValueChange={(value) => setConfig({ showModelTag: value })} />}
        />
        <List.Item
          title="do not keep preload model"
          right={(props) => <Switch {...props} value={isSwitchOn} onValueChange={(value) => setConfig({ showModelTag: value })} />}
        /> */}
      </List.Section>
    </View>
  );
};