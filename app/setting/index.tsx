import styles, { getStyles } from '@/styles/style';
import { router } from 'expo-router';
import * as React from 'react';
import { StyleProp, View, Text } from 'react-native';
import { List, TextInput } from 'react-native-paper';
import Divider from '@/components/Divider';
import { useAppTheme } from '@/components/PaperTheme';
import { useOllamaStore } from '@/store/useOllamaStore';

function isValidURLWithFallback(urlstr: string) {
  try {
    const newurl = urlstr.includes("://") ? urlstr : `http://${urlstr}`;
    return URL.canParse(newurl);
  } catch (error) {
    return false;
  }
}

const listItemStyle: StyleProp<any> = { paddingHorizontal: 6, borderRadius: 6, overflow: "hidden" }

const Setting = () => {
  const [text, setText] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isChecking, setIsChecking] = React.useState(false);
  const { initialize, checkService } = useOllamaStore();

  const {
    colors: { error: errorColor },
  } = useAppTheme();

  const validateInput = async (input: string) => {
    const inputText = input.trim()
    if (!inputText) {
      setError(null);
      return
    }
    if (!isValidURLWithFallback(inputText)) {
      setError("invalid_host_format");
      return false;
    }
    setIsChecking(true);
    try {
      initialize(`http://${inputText}:11434`);
      const isAvailable = await checkService();
      if (!isAvailable) {
        setError("ollama_service_unavailable");
        return false;
      }
      setError(null);
      return true;
    } catch (err) {
      setError("connection_failed");
      return false;
    } finally {
      setIsChecking(false);
    }
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
        placeholder="localhost:11434"
        error={!!error}
        disabled={isChecking}
        autoCapitalize="none"
        left={<TextInput.Icon icon="plus" color={error ? errorColor : undefined} />}
        right={
          isChecking ?
            <TextInput.Icon icon="loading" color={error ? errorColor : undefined} /> :
            <TextInput.Icon icon="content-save" color={error ? errorColor : undefined} />
        }
      />
      {error && (
        <Text style={[getStyles("py-4"), { color: errorColor }]}>
          {error === "invalid_host_format" && "Invalid host format"}
          {error === "invalid_ip_address" && "Invalid IP address"}
          {error === "ollama_service_unavailable" && "Ollama service is not available"}
          {error === "connection_failed" && "Failed to connect to Ollama service"}
        </Text>
      )}

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