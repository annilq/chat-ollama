import { Alert } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ollama, MessageRole } from './OllamaApi';
import { Message } from 'ollama';
// import { User, Assistant, Message, MessageRole } from './types'; 

let images: string[] = [];

const getHistory = async (addToSystem?: string): Promise<Message[]> => {
  let system = await AsyncStorage.getItem("system") ?? "You are a helpful assistant";
  const noMarkdown = await AsyncStorage.getItem("noMarkdown") ?? false;

  if (noMarkdown) {
    system += "\nYou must not use markdown or any other formatting language in any way!";
  }

  if (addToSystem) {
    system += `\n${addToSystem}`;
  }

  let history: Message[] = [];
  const useSystem = await AsyncStorage.getItem("useSystem") ?? true;
  if (useSystem) {
    history.push({ role: MessageRole.SYSTEM, content: system });
  }

  const messages = await AsyncStorage.getItem("messages") ?? [];
  images = [];

  messages.forEach(async (message) => {
    const text = message.text;
    if (text) {
      history.push({
        role: message.author.id === 'user' ? MessageRole.USER : MessageRole.SYSTEM,
        content: text,
        images: images.length > 0 ? images : undefined
      });
      images = [];
    } else {
      let uri = message.uri as string;
      const content = uri.startsWith("data:image/png;base64,")
        ? uri.slice("data:image/png;base64,".length)
        : await getBase64FromUri(uri);
      images.push(content);
    }
  });

  return history.reverse();
};

const getBase64FromUri = async (uri: string): Promise<string> => {
  // 读取文件并转换为 base64 编码
  const fileData = await fetch(uri);
  const buffer = await fileData.arrayBuffer();
  return Buffer.from(buffer).toString('base64');
};

const getHistoryString = async (uuid: string): Promise<any[]> => {
  const chats = await AsyncStorage.getItem("chats") ?? [];
  let messages = [];

  chats.forEach((chat) => {
    if (chat.uuid === uuid) {
      messages = chat.messages;
    }
  });

  if (messages[0]?.role === 'system') {
    messages.shift(); // 删除 system 消息
  }

  messages.forEach((message) => {
    if (message.type === 'image') {
      message.content = `<${message.role} inserted an image>`;
    }
  });

  return messages;
};


const send = async (
  value: string,
  context: any,
  setState: any,
  onStream?: (currentText: string, done: boolean) => void,
  addToSystem?: string
): Promise<string> => {
  setState({ sendable: false });

  const host = await AsyncStorage.getItem("host");
  if (!host) {
    Alert.alert("Error", "No host selected.");
    if (onStream) onStream("", true);
    return "";
  }

  const chatAllowed = await AsyncStorage.getItem("chatAllowed") ?? true;
  const model = await AsyncStorage.getItem("model");
  if (!chatAllowed || !model) {
    Alert.alert("Error", model ? "Model not selected." : "Chat not allowed.");
    if (onStream) onStream("", true);
    return "";
  }

  const chatUuid = await AsyncStorage.getItem("chatUuid") ?? uuidv4();
  if (!chatUuid) {
    await AsyncStorage.setItem("chatUuid", chatUuid);
  }

  const history = await getHistory(addToSystem);

  history.push({
    role: MessageRole.USER,
    content: value.trim(),
    images: images.length > 0 ? images : undefined
  });

  const newId = uuidv4();

  try {
    const response = await ollama.chat({
      model,
      messages: history,
      keep_alive: 300
    });

    let text = "";
    
    response.on('data', (chunk) => {
      text += chunk.content;
      if (onStream) onStream(text, false);
    });

    response.on('end', () => {
      if (onStream) onStream(text, true);
      setState({});
    });

    return text;
  } catch (error) {
    console.error("Error during send:", error);
    setState({ chatAllowed: true });
    return "";
  }
};

// Helper function to encode JSON as a string
function jsonEncode(data: any): string {
  return JSON.stringify(data);
}

// Helper function to decode JSON string
function jsonDecode(data: string): any {
  return JSON.parse(data);
}


// Function to get the title from AI
async function getTitleAi(history: any[]): Promise<string> {
  try {
    // Mocking the API call using axios (Replace with your actual endpoint and payload)
    const generated = await chat({
      messages: [
        {
          role: 'system',
          content: `Generate a three to six word title for the conversation provided by the user. If an object or person is very important in the conversation, put it in the title as well; keep the focus on the main subject. You must not put the assistant in the focus and you must not put the word 'assistant' in the title! Do preferably use title case. Use a formal tone, don't use dramatic words, like 'mystery' Use spaces between words, do not use camel case! You must not use markdown or any other formatting language! You must not use emojis or any other symbols! You must not use general clauses like 'assistance', 'help' or 'session' in your title! \n\n~~User Introduces Themselves~~ -> User Introduction\n~~User Asks for Help with a Problem~~ -> Problem Help\n~~User has a _**big**_ Problem~~ -> Big Problem`
        },
        {
          role: 'user',
          content: `\`\`\`\n${jsonEncode(history)}\n\`\`\``
        }
      ]
    });

    let title = generated.data.message.content;
    title = title.replaceAll("\n", " ");

    const terms = [
      "\"", "'", "*", "_", ".", ",", "!", "?", ":", ";", "(", ")", "[", "]", "{", "}"
    ];

    terms.forEach(term => {
      title = title.replaceAll(term, "");
    });

    title = title.replaceAll(/<.*?>/g, ""); // Remove HTML tags
    if (title.split(":").length === 2) {
      title = title.split(":")[1];
    }

    while (title.includes("  ")) {
      title = title.replaceAll("  ", " ");
    }

    return title.trim();
  } catch (error) {
    console.error("Error in getTitleAi: ", error);
    return '';
  }
}

// Function to set the title for AI
async function setTitleAi(history: any[]): Promise<void> {
  try {
    const title = await getTitleAi(history);
    const tmp = JSON.parse(await AsyncStorage.getItem('chats') || '[]');

    for (let i = 0; i < tmp.length; i++) {
      const chat = tmp[i];
      if (chat?.uuid === chatUuid) {
        chat.title = title;
        tmp[i] = chat;
        break;
      }
    }

    await AsyncStorage.setItem('chats', JSON.stringify(tmp));
  } catch (error) {
    console.error("Error in setTitleAi: ", error);
  }
}
export { getHistory, send, getHistoryString, getTitleAi, setTitleAi };