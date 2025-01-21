import { Stack } from 'expo-router';
import { MenuIcon } from '@/components/MenuIcon';
import { i18n } from '@/util/l10n/i18n';

export default function SettingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: i18n.t('historyTitle'),
          headerShown: true,
          headerLeft: () => <MenuIcon />
        }}
      />
      <Stack.Screen
        name="/history/[id]"
      />
    </Stack>
  );
}
