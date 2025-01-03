import { PaperProvider, MD3LightTheme as DefaultTheme, useTheme, Portal, Snackbar } from 'react-native-paper';
import { PortalProvider } from '@gorhom/portal';
import { useSnackBarStore } from "@/store/useSnackbar";

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

export function PaperTheme({ children }: { children: React.ReactNode }) {
  const snackState = useSnackBarStore();

  return (
    <PaperProvider theme={theme}>
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

