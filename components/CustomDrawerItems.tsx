import { DrawerContentComponentProps, DrawerItem } from "@react-navigation/drawer";
import Ionicons from "@expo/vector-icons/Ionicons";
import { i18n } from '@/util/l10n/i18n';
import { useAppTheme } from "./ThemeProvider";

export function CustomDrawerItems(props: DrawerContentComponentProps) {
  const { colors: { onBackground } } = useAppTheme()

  return (
    <>
      <DrawerItem
        label={i18n.t("optionNewChat")}
        labelStyle={{ color: onBackground }}
        icon={({ size }) => (
          <Ionicons name="add" size={size} color={onBackground} />
        )}
        onPress={() => props.navigation.navigate('chat/[id]')}
      />
      <DrawerItem
        label={i18n.t("optionSettings")}
        labelStyle={{ color: onBackground }}
        icon={({ size }) => (
          <Ionicons name="settings-outline" size={size} color={onBackground} />
        )}
        onPress={() => props.navigation.navigate('setting')}
      />
    </>
  )
} 