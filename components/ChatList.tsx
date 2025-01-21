import { router } from 'expo-router';
import useChatStore, { Chat } from "@/store/useChats";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import { List } from "react-native-paper";
import { View } from 'react-native';
import { i18n } from '@/util/l10n/i18n';
import { useAppTheme } from './ThemeProvider';

const MAX_DRAWER_ITEMS = 5;

export function ChatList(props: DrawerContentComponentProps) {
  const { chats } = useChatStore();
  const { colors } = useAppTheme();

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

      {chats.length > 0 ? (
        <List.Item
          title={i18n.t("chats")}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => {
            router.push('/history');
            props.navigation.dispatch(DrawerActions.closeDrawer());
          }}
        />
      ) : (
        <List.Item
          title={i18n.t("optionNoChatFound")}
          titleStyle={{
            color: colors.secondary,
          }}
          left={props => <List.Icon {...props} icon="help" />}
          onPress={() => {
            router.push('/history');
            props.navigation.dispatch(DrawerActions.closeDrawer());
          }}
        />
      )}
    </View>
  );
}

function ChatItem(props: { data: Chat, onPress: () => void }) {
  const { data, onPress } = props;
  const lastMessage = data.messages[data.messages.length - 1];
  const defaultTitle = lastMessage?.text || lastMessage?.metadata?.text;

  return (
    <List.Item
      title={data.title || defaultTitle}
      onPress={onPress}
    />
  );
}