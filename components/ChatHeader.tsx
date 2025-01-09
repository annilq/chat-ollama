import React from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton } from 'react-native-paper';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChatModal } from './ChatModal';
import { useOllamaStore } from '@/store/useOllamaStore';

export const ChatHeader = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { refreshModels } = useOllamaStore()
  return (
    <>
      <View style={[styles.header, { paddingTop: insets.top }]}>
        <View style={styles.toolbar}>
          <IconButton
            icon="menu"
            size={24}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          />
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