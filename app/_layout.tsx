import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';

import { Drawer } from 'expo-router/drawer';
import { DrawerContent } from "@/components/DrawerContent";
import Ionicons from "@expo/vector-icons/Ionicons";
import { expo } from '../app.json';
import { AppRegistry } from "react-native";
import { MenuIcon } from "@/components/MenuIcon";

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <PaperProvider>
        <ActionSheetProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
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
                name="index"
                options={{
                  drawerLabelStyle: {
                    color: "current"
                  },
                  title: 'Add',
                  headerShown: true,
                  drawerIcon: ({ focused, size, color }) => (
                    <Ionicons
                      name="add"
                      size={size}
                    />
                  ),
                  headerLeft: () => <MenuIcon />
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
      </PaperProvider>
    </SafeAreaProvider>
  );
}
AppRegistry.registerComponent(expo.name, () => RootLayout);

