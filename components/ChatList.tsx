import useChatStore, { Chat } from "@/store/useChats";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";
import { List } from "react-native-paper";


export function ChatList(props: DrawerContentComponentProps) {
  const { chats } = useChatStore()
  console.log(chats);

  return (chats.map(chat => (
    <ChatItem
      data={chat}
      key={chat.id}
      onPress={() => {
        props.navigation.dispatch(DrawerActions.closeDrawer())
      }}
    />)));
}

function ChatItem(props: { data: Chat, onPress: () => void }) {
  const { data, onPress } = props
  const defaultTitle = data.messages[data.messages.length - 1].text
  return (
    <List.Item
      title={data.title || defaultTitle}
      onPress={onPress}
    // description="Item description"
    // left={props => <List.Icon {...props} icon="folder" />}
    />
  )

}