import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useSnackBarStore } from "@/store/useSnackbar";
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import { useAppTheme } from './ThemeProvider';

const ToastDuration = 2000

export const MessageToast = () => {
  const { visible, message, setSnack } = useSnackBarStore();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const { colors } = useAppTheme()

  useEffect(() => {
    if (visible) {
      bottomSheetRef.current?.expand();
      const timer = setTimeout(() => {
        bottomSheetRef.current?.close();
      }, ToastDuration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      enablePanDownToClose={false}
      enableOverDrag={false}
      handleIndicatorStyle={{ display: "none" }}
      onChange={(index: number) => {
        if (index === -1) {
          setSnack({ visible: false });
        }
      }}
      onClose={() => setSnack({ visible: false })}
      backgroundStyle={{ backgroundColor: colors.onBackground }}
    >
      <BottomSheetView>
        <View style={styles.contentContainer}>
          <Text style={{ color: colors.background }}>{message}</Text>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  contentContainer: {
    width: "100%",
    paddingInline: 20,
    paddingBottom:20,
    minHeight: 60
  },
}); 