import { View, StyleSheet, Alert } from 'react-native';
import { List, Text, Divider, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import useChatStore, { Chat } from '@/store/useChats';
import { formatDate } from "@/util/date";
import { useState, useMemo } from 'react';
import { useActionSheet } from '@expo/react-native-action-sheet';

export default function HistoryPage() {
  const { chats, deleteChat } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');
  const { showActionSheetWithOptions } = useActionSheet();

  const filteredChats = useMemo(() => {
    if (!searchQuery) return chats;
    return chats.filter((chat: Chat) => {
      const title = chat.title || '';
      const lastMessage = chat.messages[chat.messages.length - 1]?.text || '';
      const searchLower = searchQuery.toLowerCase();
      return (
        title.toLowerCase().includes(searchLower) ||
        lastMessage.toLowerCase().includes(searchLower)
      );
    });
  }, [chats, searchQuery]);

  const handleDelete = (chatId: string) => {
    Alert.alert(
      "Delete Chat",
      "Are you sure you want to delete this chat?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteChat(chatId)
        }
      ]
    );
  };

  const handleLongPress = (chat: Chat) => {
    showActionSheetWithOptions(
      {
        options: ["Copy Title", "Delete", "Cancel"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            // Copy title logic here if needed
            break;
          case 1:
            handleDelete(chat.id);
            break;
        }
      }
    );
  };

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search chats"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <List.Section>
        {filteredChats.map((chat: Chat) => {
          const lastMessage = chat.messages[chat.messages.length - 1];
          const previewText = lastMessage?.text || 'New Chat';

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
            <Text>No chats found</Text>
          </View>
        )}
      </List.Section>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  searchBar: {
    margin: 16,
    elevation: 0,
    backgroundColor: '#f5f5f5',
  },
  date: {
    fontSize: 12,
    color: '#666',
    alignSelf: 'center',
    marginRight: 8,
  },
  emptyState: {
    padding: 16,
    alignItems: 'center',
  }
});
