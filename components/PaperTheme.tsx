import { PaperProvider, MD3LightTheme as DefaultTheme, useTheme, Portal, Snackbar } from 'react-native-paper';
import { PortalProvider } from '@gorhom/portal';
import { useSnackBarStore } from "@/store/useSnackbar";
import { useConfigStore } from '@/store/useConfig';
import { PaperLightTheme, PaperDarkTheme } from '@/util/theme';

export type AppTheme = typeof PaperLightTheme;
export const useAppTheme = () => useTheme<AppTheme>();

export function PaperTheme({ children }: { children: React.ReactNode }) {
  const snackState = useSnackBarStore();
  const { config: { theme } } = useConfigStore();

  return (
    <PaperProvider theme={theme === "dark" ? PaperDarkTheme : PaperLightTheme}>
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
  );
}

