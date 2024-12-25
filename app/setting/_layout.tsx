import { Stack } from 'expo-router';
import { MenuIcon } from '@/components/MenuIcon';

export default function SettingLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: '设置',
          headerLeft: () => <MenuIcon />
        }} 
      />
      <Stack.Screen name="assistant" options={{ title: '助手' }} />
      <Stack.Screen name="interface" options={{ title: '界面' }} />
      <Stack.Screen name="export" options={{ title: '导出' }} />
      <Stack.Screen name="about" options={{ title: '关于' }} />
    </Stack>
  );
}
