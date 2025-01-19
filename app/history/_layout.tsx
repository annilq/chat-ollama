import { Stack } from 'expo-router';
import { MenuIcon } from '@/components/MenuIcon';

export default function SettingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          title: 'history',
          headerLeft: () => <MenuIcon />
        }}
      />
      <Stack.Screen
        name="/history/[id]"
        options={{
          title: 'Chat',
        }}
      />
    </Stack>
  );
}
