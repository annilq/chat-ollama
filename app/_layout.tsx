import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider, MD3LightTheme as DefaultTheme, useTheme, } from 'react-native-paper';
import { PortalProvider } from '@gorhom/portal';

import { Drawer } from 'expo-router/drawer';
import { DrawerContent } from "@/components/DrawerContent";
import Ionicons from "@expo/vector-icons/Ionicons";
import { expo } from '../app.json';
import { AppRegistry } from "react-native";
import { ChatHeader } from '@/components/ChatHeader';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    outline: "#000000",
    primary: '#000000',
    background: "#ffffff"
  },
};

export type AppTheme = typeof theme;

export const useAppTheme = () => useTheme<AppTheme>();

export default function RootLayout() {
  return (
    <SafeAreaProvider style={{ backgroundColor: '#FFFFFF' }}>
      <PaperProvider theme={theme}>
        <ActionSheetProvider>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <PortalProvider>
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
                    title: 'New Chat',
                    headerShown: true,
                    header: () => <ChatHeader />,
                    drawerIcon: ({ focused, size, color }) => (
                      <Ionicons
                        name="add"
                        size={size}
                      />
                    ),
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
            </PortalProvider>
          </GestureHandlerRootView>
        </ActionSheetProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
AppRegistry.registerComponent(expo.name, () => RootLayout);

