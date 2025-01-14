import { View, StyleSheet } from 'react-native';
import { List, Text, Divider, Searchbar } from 'react-native-paper';
import { router } from 'expo-router';
import useChatStore, { Chat } from '@/store/useChats';
import { formatDate } from "@/util/date";
import { useState, useMemo } from 'react';

export default function HistoryPage() {
  const { chats } = useChatStore();
  const [searchQuery, setSearchQuery] = useState('');

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
