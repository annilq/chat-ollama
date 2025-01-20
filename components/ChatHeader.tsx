import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatModal } from './ChatModal';
import { useOllamaStore } from '@/store/useOllamaStore';

export const ChatHeader = (props: { leftIcon?: "menu" | "back" }) => {
  const { leftIcon = "menu" } = props
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { refreshModels } = useOllamaStore()
  return (
    <>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.toolbar}>
          {leftIcon === "menu" ? (
            <IconButton
              icon="menu"
              size={24}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            />) : (
            <IconButton
              icon="chevron-left"
              size={24}
              onPress={() => navigation.goBack()}
            />)
          }
          <ChatModal />
          <IconButton
            icon="refresh"
            size={24}
            onPress={refreshModels}
          />
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
  },
  toolbar: {
    height: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 4,
  },
}); 