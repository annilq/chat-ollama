import { DrawerContentScrollView, DrawerItemList, DrawerItem, DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";

import Divider from "./Divider";
import DrawerHeader from "./DrawerHeader";
import { ChatList } from "./ChatList";

export function DrawerContent(props: DrawerContentComponentProps) {

  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader />
      <Divider />
      <DrawerItemList {...props} />
      <Divider />
      <ChatList {...props} />
    </DrawerContentScrollView>
  );
}

