import styles, { getStyles } from '@/styles/style';
import { router } from 'expo-router';
import * as React from 'react';
import { StyleProp, View, Text } from 'react-native';
import { List, TextInput } from 'react-native-paper';
import Divider from '@/components/Divider';
import { useAppTheme } from '@/components/PaperTheme';

const listItemStyle: StyleProp<any> = { paddingHorizontal: 6, borderRadius: 6, overflow: "hidden" }

const Setting = () => {
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  const {
    colors: { error: errorColor },
  } = useAppTheme();

  const validateInput = (input: string) => {
    if (input.trim() === "") {
      setError("invalid_host");
      return false;
    }
    setError(null);
    return true;
  };

  const handleTextChange = (input: string) => {
    setText(input);
    validateInput(input);
  };

  return (
    <View style={[styles["px-4"], styles["mt-4"]]} >
      <TextInput
        value={text}
        onChangeText={handleTextChange}
        mode="outlined"
        label="host"
        placeholder="host"
        error={!!error}
        left={<TextInput.Icon icon="plus" color={error ? errorColor : undefined} />}
        right={<TextInput.Icon icon="content-save" color={error ? errorColor : undefined} />}
      />
      {error && <Text style={[getStyles("py-4"), { color: errorColor }]}>{error}</Text>}

      <Divider />
      <List.Section>
        <List.Item
          style={listItemStyle}
          title="brain"
          left={() => <List.Icon icon="head-cog" />}
          onPress={() => {
            router.push("/setting/assistant")
          }}
        />
        <List.Item
          style={listItemStyle}
          title="interface"
          left={() => <List.Icon icon="card-outline" />}
          onPress={() => {
            router.push("/setting/interface")
          }}
        />
        <List.Item
          style={listItemStyle}
          title="headphones"
          left={() => <List.Icon icon="headphones" />}
          onPress={() => {
            router.push("/setting/export")
          }}
        />
        <List.Item
          style={listItemStyle}
          title="export"
          left={() => <List.Icon icon="share-variant" />}
          onPress={() => {
            router.push("/setting/export")
          }}
        />
        <List.Item
          style={listItemStyle}
          title="about"
          left={() => <List.Icon icon="help-circle" />}
          onPress={() => {
            router.push("/setting/about")
          }}
        />
      </List.Section>
    </View>
  );
};

export default Setting;