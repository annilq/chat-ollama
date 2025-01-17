import AsyncStorage from '@react-native-async-storage/async-storage';
import { v4 as uuidv4 } from 'uuid';

import { MessageRole } from './ollama_api';
import { ChatResponse, Message } from 'ollama';
import { Chat, CommonMessage } from '@/store/useChats';
import { useOllamaStore } from '@/store/useOllamaStore';
import { MessageType } from '@flyerhq/react-native-chat-ui';
import { i18n } from '@/util/l10n/i18n';

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

  const messages = (await AsyncStorage.getItem("messages") ?? []) as CommonMessage[];
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
  const chatstr = await AsyncStorage.getItem("chats");
  const chats: Chat[] = chatstr ? JSON.parse(chatstr) : [];
  let messages: CommonMessage[] = [];

  chats.forEach((chat) => {
    if (chat.id === uuid) {
      messages = chat.messages;
    }
  });

  if (messages[0]?.role === MessageRole.SYSTEM) {
    messages.shift(); // delete system message
  }

  return messages;
};



// Function to get the title from AI
async function getTitleAi(messages: CommonMessage[]): Promise<string> {
  try {
    // Mocking the API call using axios (Replace with your actual endpoint and payload)
    const model = useOllamaStore.getState().selectedModel!
    const generatedResponse = await useOllamaStore.getState().ollama.chat({
      model,
      stream: false,
      messages: [
        {
          role: 'system',
          content: `Generate a three to six word title for the conversation provided by the user. If an object or person is very important in the conversation, put it in the title as well; keep the focus on the main subject. You must not put the assistant in the focus and you must not put the word 'assistant' in the title! Do preferably use title case. Use a formal tone, don't use dramatic words, like 'mystery' Use spaces between words, do not use camel case! You must not use markdown or any other formatting language! You must not use emojis or any other symbols! You must not use general clauses like 'assistance', 'help' or 'session' in your title! \n\n~~User Introduces Themselves~~ -> User Introduction\n~~User Asks for Help with a Problem~~ -> Problem Help\n~~User has a _**big**_ Problem~~ -> Big Problem`
        },
        {
          role: 'user',
          content: messages.map(message => message.text || '').join('\n')
        }
      ]
    });
    console.log(generatedResponse);
    if (!generatedResponse?.done) {
      return messages[messages.length - 1].text
    }

    let title = generatedResponse?.message.content!;
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
async function setTitleAi(chatUuid: string, history: any[]): Promise<void> {
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
const getOllamaMessageFromChatMessage = (messages: CommonMessage[]): Message[] => {

  return messages.map(message => {
    const { role = MessageRole.ASSISTANT, type = "text" } = message
    switch (type) {
      case "text":
        return ({
          role: role,
          content: (message as MessageType.Text).text!
        })

      case "image":
        // split base64
        const base64 = (message as MessageType.Image).uri.split("base64,")[1]
        return ({
          role: role,
          content: "",
          images: [base64]
        })
      case "file":
        return ({
          role: role,
          content: "",
          images: [message.uri]
        })
      case "unsupported":
        return ({
          role: role,
          content: ""
        })

      case "custom":
        return ({
          role: role,
          content: ""
        })
    }
  }).reverse()
}

const getAssistantMessageFromOllama = (ollamaResponse: ChatResponse): CommonMessage => {
  return {
    id: uuidv4(),
    text: ollamaResponse.message.content,
    createdAt: ollamaResponse.created_at.valueOf(),
    author: {
      id: MessageRole.ASSISTANT,
    },
    type: 'text',
    role: MessageRole.ASSISTANT
  };
};


// get system prompt
const getSystemMessage = (text: string): CommonMessage => {
  return {
    id: uuidv4(),
    text,
    createdAt: Date.now(),
    author: {
      id: MessageRole.SYSTEM,
    },
    type: 'text',
    role: MessageRole.SYSTEM
  };
};
export { getHistory, getHistoryString, getTitleAi, setTitleAi, getAssistantMessageFromOllama, getSystemMessage, getOllamaMessageFromChatMessage };