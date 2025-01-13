import { DrawerContentComponentProps, DrawerItem } from "@react-navigation/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";

export function CustomDrawerItems(props: DrawerContentComponentProps) {
  return (
    <>
      <DrawerItem
        label="Chat"
        icon={({ size }) => (
          <Ionicons name="add" size={size} />
        )}
        onPress={() => props.navigation.navigate('chat/[id]')}
      />
      <DrawerItem
        label="Setting"
        icon={({ size }) => (
          <Ionicons name="settings-outline" size={size} />
        )}
        onPress={() => props.navigation.navigate('setting')}
      />
    </>
  )
} 