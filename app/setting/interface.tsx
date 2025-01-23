import styles from '@/styles/style';
import * as React from 'react';
import { View } from 'react-native';
import { Switch, List, SegmentedButtons, Menu, Button } from 'react-native-paper';
import Divider from '@/components/Divider';
import { RequestType, theme, useConfigStore } from '@/store/useConfig';
import { i18n, languages } from '@/util/l10n/i18n';

export default () => {
  const {
    config: {
      locale,
      theme,
      showModelTag,
      showTipsInDrawer,
      clearChatWhenResetModel,
      requestType,
      generateTitles,
      messageEditable,
      showConfirmWhenChatDelete,
    },
    setConfig
  } = useConfigStore()

  const [visible, setVisible] = React.useState(false);
  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLanguageChange = (locale: string) => {    
    setConfig({ locale });
    i18n.locale = locale;
    closeMenu();
  };

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
        <List.Item
          title={i18n.t("settingsLanguage")}
          right={(props) => (
            <Menu
              {...props}
              visible={visible}
              onDismiss={closeMenu}
              anchor={<Button onPress={openMenu}>{languages.find(ln => ln.value === locale)?.title}</Button>}>
              {languages.map(ln => (
                <Menu.Item
                  key={ln.value}
                  onPress={() => handleLanguageChange(ln.value)}
                  title={ln.title}
                />
              ))}
            </Menu>
          )}
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
        <Divider />

        <SegmentedButtons
          value={theme}
          onValueChange={(value) => setConfig({ theme: value as theme })}
          buttons={[
            {
              value: 'light',
              label: i18n.t("settingsBrightnessLight"),
            },
            {
              value: 'dark',
              label: i18n.t("settingsBrightnessDark"),
            },
            {
              value: "",
              label: i18n.t("settingsBrightnessSystem"),
            },
          ]}
        />
      </List.Section>
    </View>
  );
};