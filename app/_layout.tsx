import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { expo } from '../app.json';
import { AppRegistry } from "react-native";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AppDrawer } from "@/components/Drawer";


export default function RootLayout() {
  // Initialize Ollama store and set up health check

  return (
    <SafeAreaProvider>
      <ActionSheetProvider>
        <GestureHandlerRootView>
          <ThemeProvider>
            <AppDrawer />
          </ThemeProvider>
        </GestureHandlerRootView>
      </ActionSheetProvider>
    </SafeAreaProvider>
  );
}

AppRegistry.registerComponent(expo.name, () => RootLayout);
