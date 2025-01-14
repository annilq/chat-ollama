import { Stack } from 'expo-router';
import { MenuIcon } from '@/components/MenuIcon';
import { useAppTheme } from '@/components/PaperTheme';

export default function SettingLayout() {
  const {
    colors: { background },
  } = useAppTheme();

  return (
    <Stack
      screenOptions={{
        contentStyle: { backgroundColor: background }
      }}
    >
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
