import { router } from 'expo-router';
import useChatStore, { Chat } from "@/store/useChats";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import { List } from "react-native-paper";
import { View } from 'react-native';
import { i18n } from '@/util/l10n/i18n';

const MAX_DRAWER_ITEMS = 5;

export function ChatList(props: DrawerContentComponentProps) {
  const { chats } = useChatStore();
  const displayChats = chats.slice(0, MAX_DRAWER_ITEMS);

  return (
    <View>
      {displayChats.map(chat => (
        <ChatItem
          data={chat}
          key={chat.id}
          onPress={() => {
            router.push(`/chat/${chat.id}`);
            props.navigation.dispatch(DrawerActions.closeDrawer())
          }}
        />
      ))}

      {chats.length>0 ? (
        <List.Item
          title="View All Chats"
          left={props => <List.Icon {...props} icon="history" />}
          onPress={() => {
            router.push('/history');
            props.navigation.dispatch(DrawerActions.closeDrawer());
          }}
        />
      ) : false}
    </View>
  );
}

function ChatItem(props: { data: Chat, onPress: () => void }) {
  const { data, onPress } = props;
  const lastMessage = data.messages[data.messages.length - 1];
  const defaultTitle = lastMessage?.text || 'New Chat';

  return (
    <List.Item
      title={data.title || defaultTitle}
      onPress={onPress}
    />
  );
}