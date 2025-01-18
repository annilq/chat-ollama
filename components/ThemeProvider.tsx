import { PaperProvider, useTheme as usePaperTheme, Portal, Snackbar } from 'react-native-paper';
import { PortalProvider } from '@gorhom/portal';
import { useSnackBarStore } from "@/store/useSnackbar";
import { useConfigStore } from '@/store/useConfig';
import { PaperLightTheme, PaperDarkTheme } from '@/util/theme';
import { Appearance } from 'react-native';
import React, { createContext, useContext, useMemo } from 'react';
import { adaptNavigationTheme } from "react-native-paper";
import {
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
  ThemeProvider as NavigationDefaultThemeProvider,
} from "@react-navigation/native";
import merge from "deepmerge";

const { LightTheme, DarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavigationDefaultTheme,
  reactNavigationDark: NavigationDarkTheme,
});

export type AppTheme = typeof PaperLightTheme;

const ThemeContext = createContext<AppTheme>(PaperLightTheme);

export const useAppTheme = () => {
  const theme = useContext(ThemeContext);
  const paperTheme = usePaperTheme<AppTheme>();
  return theme || paperTheme;
};
const CombinedLightTheme = merge(LightTheme, PaperLightTheme);
const CombinedDarkTheme = merge(DarkTheme, PaperDarkTheme);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const snackState = useSnackBarStore();
  const { config: { theme } } = useConfigStore();

  const paperTheme = useMemo(() =>
    (theme || Appearance.getColorScheme()) === "dark" ? CombinedDarkTheme : CombinedLightTheme,
    [theme]
  );

  return (
    <NavigationDefaultThemeProvider value={paperTheme}>
      <ThemeContext.Provider value={paperTheme}>
        <PaperProvider theme={paperTheme}>
          <PortalProvider>
            {children}
            <Portal>
              <Snackbar
                elevation={5}
                visible={snackState.visible}
                onDismiss={() => snackState.setSnack({ visible: false })}
                action={{
                  label: 'close',
                }}
              >
                {snackState.message}
              </Snackbar>
            </Portal>
          </PortalProvider>
        </PaperProvider>
      </ThemeContext.Provider>
    </NavigationDefaultThemeProvider>
  );
}
