import { Stack } from 'expo-router';
import { MenuIcon } from '@/components/MenuIcon';
import { useAppTheme } from '@/components/ThemeProvider';

export default function SettingLayout() {
  const {
    colors: { background },
  } = useAppTheme();

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
