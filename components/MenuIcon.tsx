import { TouchableOpacity } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from 'expo-router';
import { useAppTheme } from './ThemeProvider';

interface MenuIconProps {
  color?: string;
  size?: number;
}

export const MenuIcon = ({ size = 24 }: MenuIconProps) => {
  const navigation = useNavigation();
  const { colors: { onBackground } } = useAppTheme()
  return (
    <TouchableOpacity
      onPress={() => {
        // @ts-ignore
        navigation.toggleDrawer();
      }}
    >
      <Ionicons name="menu" size={size} color={onBackground} />
    </TouchableOpacity>
  );
}; 