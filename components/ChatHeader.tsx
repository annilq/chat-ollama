import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const ChatHeader = () => {
  const navigation = useNavigation();
  const { showActionSheetWithOptions } = useActionSheet();
  const insets = useSafeAreaInsets();

  const handleMenuPress = () => {
    navigation.dispatch(DrawerActions.openDrawer());
  };

  const handleDropdownPress = () => {
    showActionSheetWithOptions(
      {
        options: ['新对话', '继续对话', '取消'],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            // 处理新对话
            break;
          case 1:
            // 处理继续对话
            break;
        }
      }
    );
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top }]}>
      <View style={styles.toolbar}>
        <IconButton
          icon="menu"
          size={24}
          onPress={handleMenuPress}
        />
        <IconButton
          icon="chevron-down"
          size={24}
          onPress={handleDropdownPress}
        />
        <IconButton
          icon="refresh"
          size={24}
          onPress={() => {
            // 处理刷新逻辑
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  toolbar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
}); 