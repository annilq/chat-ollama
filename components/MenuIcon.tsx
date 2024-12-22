import { TouchableOpacity } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from 'expo-router';

interface MenuIconProps {
  color?: string;
  size?: number;
}

export const MenuIcon = ({ color = '#000', size = 24}: MenuIconProps) => {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity 
      onPress={() => {
        // @ts-ignore
        navigation.toggleDrawer();
      }}
    >
      <Ionicons name="menu" size={size} color={color} />
    </TouchableOpacity>
  );
}; 