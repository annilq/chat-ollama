import { DrawerItem, DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerActions } from "@react-navigation/native";


export function ChatList(props: DrawerContentComponentProps) {

  return (
    < >
      <DrawerItem
        label="Close drawer"
        // icon={}
        onPress={() => props.navigation.dispatch(DrawerActions.closeDrawer())}
      />
      <DrawerItem
        label="Toggle drawer"
        onPress={() => props.navigation.dispatch(DrawerActions.toggleDrawer())}
      />
    </>
  );
}

