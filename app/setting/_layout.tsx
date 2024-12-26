import { Stack } from 'expo-router';
import { MenuIcon } from '@/components/MenuIcon';
import { useAppTheme } from '../_layout';

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
          title: 'setting',
          headerLeft: () => <MenuIcon />
        }}
      />
      <Stack.Screen name="assistant" options={{ title: 'assistant' }} />
      <Stack.Screen name="interface" options={{ title: 'interface' }} />
      <Stack.Screen name="export" options={{ title: 'export' }} />
      <Stack.Screen name="about" options={{ title: 'about' }} />
    </Stack>
  );
}
