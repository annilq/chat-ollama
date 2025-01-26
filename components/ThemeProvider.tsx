import { PaperProvider, useTheme as usePaperTheme } from 'react-native-paper';
import { PortalProvider } from '@gorhom/portal';
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
import { MessageToast } from '@/components/MessageToast';

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
            <MessageToast />
          </PortalProvider>
        </PaperProvider>
      </ThemeContext.Provider>
    </NavigationDefaultThemeProvider>
  );
}
