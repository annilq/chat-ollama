import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Drawer } from 'expo-router/drawer';
import { DrawerContent } from "@/components/DrawerContent";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <ActionSheetProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer
            screenOptions={{
              drawerStyle: {
                width: 240
              },
              drawerItemStyle: {
                backgroundColor: 'transparent',
              }
            }}
            drawerContent={(props) => <DrawerContent {...props} />}
          >
            <Drawer.Screen
              name="index"
              options={{
                drawerLabelStyle: {
                  color: "current"
                },
                title: 'Add',
                drawerIcon: ({ focused, size, color }) => (
                  <Ionicons
                    name="add"
                    size={size}
                  />
                )
              }} />
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
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </SafeAreaProvider>
  );
}
