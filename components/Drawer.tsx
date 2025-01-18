
import { Drawer } from 'expo-router/drawer';
import { DrawerContent } from "@/components/DrawerContent";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ChatHeader } from '@/components/ChatHeader';
// import { useAppTheme } from "@/components/PaperTheme";
import { i18n } from "@/util/l10n/i18n";


export function AppDrawer() {
  // Initialize Ollama store and set up health check
  // const theme = useAppTheme();

  return (

    <Drawer
      screenOptions={() => ({
        drawerStyle: {
          width: 240,
          // backgroundColor: theme.colors.background,
        },
        drawerItemStyle: {
          // backgroundColor: theme.colors.background,
        },
        headerShown: false,
      })}
      drawerContent={(props) => <DrawerContent {...props} />}
    >
      <Drawer.Screen
        name="chat/[id]" // This creates a dynamic route
        options={{
          // drawerLabelStyle: {
          //   color: theme.colors.primary
          // },
          title: i18n.t('optionNewChat'),
          headerShown: true,
          header: () => <ChatHeader />,
          drawerIcon: ({ focused, size, color }) => (
            <Ionicons
              name="add"
              size={size}
            />
          ),
        }}
      />
      <Drawer.Screen
        name="setting"
        options={{
          // drawerLabelStyle: {
          //   color: theme.colors.primary
          // },
          title: i18n.t('optionSettings'),
          drawerIcon: ({ focused, size, color }) => (
            <Ionicons
              name="settings-outline"
              size={size}
            />
          )
        }} />
    </Drawer>

  );
}
