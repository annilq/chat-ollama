import Markdown from "react-native-markdown-display";
import { StyleSheet } from "react-native"

const styles = StyleSheet.create({
  body: { color: '#FFFFFF', },
});
export const ChatTextRender = (props: { text: string }) => {
  return (
    <Markdown style={styles}>{props.text}</Markdown>
  );
};

