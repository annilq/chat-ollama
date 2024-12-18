import { Link } from "expo-router";
import { View, Text,StyleSheet } from "react-native";

export default function About() {
  return (
    <View>
      <View><Text>about</Text></View>
      <Link href="/" style={styles.button}>
        Go to Home screen
      </Link>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
  },
  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});