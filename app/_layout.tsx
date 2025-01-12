import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { DrawerContent } from "@/components/DrawerContent";
import Ionicons from "@expo/vector-icons/Ionicons";
import { expo } from '../app.json';
import { AppRegistry } from "react-native";
import { ChatHeader } from '@/components/ChatHeader';
import { PaperTheme } from "@/components/PaperTheme";


export default function RootLayout() {
  // Initialize Ollama store and set up health check

  return (
    <SafeAreaProvider style={{ backgroundColor: '#FFFFFF' }}>
      <ActionSheetProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <PaperTheme>
            <Drawer
              screenOptions={{
                drawerStyle: {
                  width: 240
                },
                drawerItemStyle: {
                  backgroundColor: 'transparent',
                },
                headerShown: false,
              }}
              drawerContent={(props) => <DrawerContent {...props} />}
            >
              <Drawer.Screen
                name="chat/[id]" // This creates a dynamic route
                options={{
                  drawerLabelStyle: {
                    color: "current"
                  },
                  title: 'Chat',
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
                  drawerLabelStyle: {
                    color: "current"
                  },
                  title: 'Setting',
                  drawerIcon: ({ focused, size, color }) => (
                    <Ionicons
                      name="settings-outline"
                      size={size}
                    />
                  )
                }} />
            </Drawer>
          </PaperTheme>
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </SafeAreaProvider>
  );
}
AppRegistry.registerComponent(expo.name, () => RootLayout);

