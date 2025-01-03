import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from "@react-navigation/drawer";

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

