import { DrawerContentScrollView, DrawerItemList, DrawerContentComponentProps } from "@react-navigation/drawer";

import Divider from "./Divider";
import DrawerHeader from "./DrawerHeader";
import { ChatList } from "./ChatList";
import { CustomDrawerItems } from "./CustomDrawerItems";

export function DrawerContent(props: DrawerContentComponentProps) {

  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader />
      <Divider />
      <CustomDrawerItems {...props} />
      <Divider />
      <ChatList {...props} />
    </DrawerContentScrollView>
  );
}

