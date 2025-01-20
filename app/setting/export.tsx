import * as React from 'react';
import { View, Share, Platform } from 'react-native';
import { List, Portal, Dialog, Button, Text, IconButton } from 'react-native-paper';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { i18n } from '@/util/l10n/i18n';
import { getStyles } from '@/styles/style';
import { CHAT_STORAGE_KEY, useChatStore } from '@/store/useChats';
import { useSnackBarStore } from '@/store/useSnackbar';
import { useAppTheme } from '@/components/ThemeProvider';

const ExportComponent = () => {
  const { chats, initializeChats } = useChatStore();
  const showSnackBar = useSnackBarStore(state => state.setSnack);
  const [importDialogVisible, setImportDialogVisible] = React.useState(false);
  const { colors } = useAppTheme()
  const exportChats = async () => {
    try {
      // Generate filename with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const fileName = `ollama-chats-${timestamp}.json`;
      const fileContent = JSON.stringify(chats, null, 2);

      if (Platform.OS === 'ios') {
        // For iOS, create temporary file and share it
        const tempFileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(tempFileUri, fileContent);
        await Share.share({
          url: tempFileUri,
          title: fileName,
        });
      } else {
        // For Android, write directly to downloads
        const fileUri = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(fileUri, fileContent);
      }

      showSnackBar({
        message: i18n.t('settingsExportChatsSuccess'),
        visible: true,
      });
    } catch (error) {
      console.error('Export error:', error);
      showSnackBar({
        message: i18n.t('settingsExportChatsFailed'),
        visible: true,
      });
    }
  };

  const handleImportConfirm = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/json',
      });

      if (result.assets && result.assets[0]) {
        const fileUri = result.assets[0].uri;
        const content = await FileSystem.readAsStringAsync(fileUri);
        const importedChats = JSON.parse(content);

        // Validate imported data structure
        if (!Array.isArray(importedChats)) {
          throw new Error('Invalid chat history format');
        }

        // Save to AsyncStorage and update state
        await AsyncStorage.setItem(CHAT_STORAGE_KEY, content);
        await initializeChats();

        showSnackBar({
          message: i18n.t('settingsImportChatsSuccess'),
          visible: true,
        });
      }
    } catch (error) {
      showSnackBar({
        message: i18n.t('settingsImportChatsFailed'),
        visible: true,
      });
    } finally {
      setImportDialogVisible(false);
    }
  };

  const handleImportCancel = () => {
    setImportDialogVisible(false);
  };

  return (
    <View style={getStyles("flex flex-1 flex-col px-4 mt-4")}>
      <List.Section style={getStyles("flex-1")}>
        <List.Item
          title={i18n.t("settingsImportChats")}
          left={() => <List.Icon icon="upload" />}
          onPress={() => setImportDialogVisible(true)}
        />
        <List.Item
          title={i18n.t("settingsExportChats")}
          left={() => <List.Icon icon="download" />}
          onPress={exportChats}
        />
      </List.Section>
      <View style={[getStyles("pr-2")]}>
        <View style={getStyles("flex flex-row items-center justify-between mb-2 gap-2")}>
          <IconButton icon={"information"} iconColor={colors.backdrop} />
          <Text style={{ 
            fontSize: 12, 
            color: colors.backdrop,
            flex: 1,
            flexWrap: 'wrap'
          }}>
            {i18n.t("settingsExportInfo")}
          </Text>
        </View>
        <View style={getStyles("flex flex-row items-center justify-between mb-2 gap-2")}>
          <IconButton icon={"alert-outline"} iconColor={colors.error} />
          <Text style={{ 
            fontSize: 12, 
            color: colors.error,
            flex: 1,
            flexWrap: 'wrap'
          }}>
            {i18n.t("settingsExportWarning")}
          </Text>
        </View>
      </View>
      <Portal>
        <Dialog visible={importDialogVisible} onDismiss={handleImportCancel}>
          <Dialog.Title>{i18n.t('settingsImportChatsTitle')}</Dialog.Title>
          <Dialog.Content>
            <Text>{i18n.t('settingsImportChatsDescription')}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={handleImportCancel}>
              {i18n.t('settingsImportChatsCancel')}
            </Button>
            <Button onPress={handleImportConfirm}>
              {i18n.t('settingsImportChatsImport')}
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

export default ExportComponent;