import { Stack } from 'expo-router';
import { MenuIcon } from '@/components/MenuIcon';
import { i18n } from '@/util/l10n/i18n';

export default function SettingLayout() {

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: i18n.t("optionSettings"),
          headerLeft: () => <MenuIcon />
        }}
      />
      <Stack.Screen name="assistant" options={{ title: i18n.t("settingsTitleBehavior") }} />
      <Stack.Screen name="interface" options={{ title: i18n.t("settingsTitleInterface") }} />
      <Stack.Screen name="export" options={{ title: i18n.t("settingsTitleExport") }} />
      <Stack.Screen name="about" options={{ title: i18n.t("settingsTitleAbout") }} />
    </Stack>
  );
}
