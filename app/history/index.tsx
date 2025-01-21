import { View, StyleSheet, Alert } from 'react-native';
import { List, Text, Divider, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import useChatStore, { Chat } from '@/store/useChats';
import { formatDate } from "@/util/date";
import { useState, useMemo } from 'react';
import { useActionSheet } from '@expo/react-native-action-sheet';
import { i18n } from '@/util/l10n/i18n';

export default function HistoryPage() {
  const { chats, deleteChat } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { showActionSheetWithOptions } = useActionSheet();

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    return chats.filter((chat: Chat) => {
      const title = chat.title || '';
      const lastMessage = chat.messages[chat.messages.length - 1];
      const lastMessageText = lastMessage.text || lastMessage.metadata?.text;
      const searchLower = searchQuery.toLowerCase();
      return (
        title.toLowerCase().includes(searchLower) ||
        lastMessageText.toLowerCase().includes(searchLower)
      );
    });
  }, [chats, searchQuery]);

  const handleDelete = (chatId: string) => {
    Alert.alert(
      i18n.t('deleteChatDialogTitle'),
      i18n.t('deleteChatDialogDescription'),

      [
        {
          text: i18n.t('cancel'),
          style: "cancel"
        },
        {
          text: i18n.t('deleteDialogDelete'),
          style: "destructive",
          onPress: () => deleteChat(chatId)
        }
      ]
    );
  };

  const handleLongPress = (chat: Chat) => {
    showActionSheetWithOptions(
      {
        options: [i18n.t('deleteDialogDelete'), i18n.t('cancel')],
        destructiveButtonIndex: 0,
        cancelButtonIndex: 1,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            handleDelete(chat.id);
            break;
          case 1:
            break;
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder={i18n.t("search")}
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <List.Section>
        {filteredChats.map((chat: Chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1];
          const previewText = lastMessage?.text || lastMessage.metadata?.text;

          return (
            <View key={chat.id}>
              <List.Item
                title={chat.title || 'Untitled Chat'}
                description={previewText}
                onLongPress={() => handleLongPress(chat)}
                right={props => (
                  <Text style={styles.date}>
                    {formatDate(lastMessage?.createdAt || chat.createdAt)}
                  </Text>
                )}
                onPress={() => router.push(`/history/${chat.id}`)}
                left={props => <List.Icon {...props} icon="chat" />}
              />
              <Divider />
            </View>
          );
        })}

        {filteredChats.length === 0 && (
          <View style={styles.emptyState}>
            <Text>{i18n.t("optionNoChatFound")}</Text>
          </View>
        )}
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBar: {
    margin: 16,
    elevation: 0,
  },
  date: {
    fontSize: 12,
    alignSelf: 'center',
    marginRight: 8,
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
  }
});
