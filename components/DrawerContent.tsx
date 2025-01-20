import { DrawerContentScrollView, DrawerContentComponentProps } from "@react-navigation/drawer";

import Divider from "./Divider";
import DrawerHeader from "./DrawerHeader";
import { ChatList } from "./ChatList";
import { CustomDrawerItems } from "./CustomDrawerItems";
import { Tips } from "./Tips";
import { useConfigStore } from "@/store/useConfig";

export function DrawerContent(props: DrawerContentComponentProps) {
  const { config: { showTipsInDrawer } } = useConfigStore();
  return (
    <DrawerContentScrollView {...props}>
      <DrawerHeader />
      <Divider />
      <CustomDrawerItems {...props} />
      <Divider />
      <ChatList {...props} />
      {showTipsInDrawer && <Tips />}
    </DrawerContentScrollView>
  );
}

