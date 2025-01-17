import { DrawerContentComponentProps, DrawerItem } from "@react-navigation/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { i18n } from '@/util/l10n/i18n';

export function CustomDrawerItems(props: DrawerContentComponentProps) {
  return (
    <>
      <DrawerItem
        label={i18n.t("optionNewChat")}
        icon={({ size }) => (
          <Ionicons name="add" size={size} />
        )}
        onPress={() => props.navigation.navigate('chat/[id]')}
      />
      <DrawerItem
        label={i18n.t("optionSettings")}
        icon={({ size }) => (
          <Ionicons name="settings-outline" size={size} />
        )}
        onPress={() => props.navigation.navigate('setting')}
      />
    </>
  )
} 