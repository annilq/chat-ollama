import { Stack } from 'expo-router';
import { MenuIcon } from '@/components/MenuIcon';

export default function SettingLayout() {
  return (
    <Stack
    screenOptions={{
      headerShown:false
    }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: 'history',
          headerShown:true,
          headerLeft: () => <MenuIcon />
        }}
      />
      <Stack.Screen
        name="/history/[id]"
        options={{
          title: 'Chat',
          // headerShown:true,
          // headerLeft: () => <MenuIcon />
        }}
      />
    </Stack>
  );
}
