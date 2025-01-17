import styles from '@/styles/style';
import * as React from 'react';
import { View } from 'react-native';
import { Switch, List, SegmentedButtons } from 'react-native-paper';
import Divider from '@/components/Divider';
import { RequestType, useConfigStore } from '@/store/useConfig';
import { i18n } from '@/util/l10n/i18n';

export default () => {
  const { config: { showModelTag, showTipsInDrawer, clearChatWhenResetModel, requestType, generateTitles, messageEditable, showConfirmWhenChatDelete, }, setConfig } = useConfigStore()

  return (
    <View style={[styles["px-4"], styles["mt-4"]]} >
      <List.Section>
        <List.Item
          title={i18n.t("settingsShowModelTags")}
          right={(props) => <Switch {...props} value={showModelTag} onValueChange={(value) => setConfig({ showModelTag: value })} />}
        />
        {/* <List.Item
          title="preload model"
          right={(props) => <Switch {...props} value={isSwitchOn} onValueChange={(value)=>setConfig({showModelTag:value})} />}
        /> */}

        <List.Item
          title={i18n.t("settingsResetOnModelChange")}
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
              label: i18n.t("settingsRequestTypeStream"),
            },
            {
              value: 'generate',
              label: i18n.t("settingsRequestTypeRequest"),
            },
          ]}
        />
        <List.Item
          title={i18n.t("settingsGenerateTitles")}
          right={(props) => <Switch {...props} value={generateTitles} onValueChange={(value) => setConfig({ generateTitles: value })} />}
        />
        <List.Item
          title={i18n.t("settingsEnableEditing")}
          right={(props) => <Switch {...props} value={messageEditable} onValueChange={(value) => setConfig({ messageEditable: value })} />}
        />
        <List.Item
          title={i18n.t("settingsAskBeforeDelete")}
          right={(props) => <Switch {...props} value={showConfirmWhenChatDelete} onValueChange={(value) => setConfig({ showConfirmWhenChatDelete: value })} />}
        />
        <List.Item
          title={i18n.t("settingsShowTips")}
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