// import { ollama } from "@/chatutil/OllamaApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChatResponse, Message } from "ollama";
import { create } from "zustand";
import { useOllamaStore } from './useOllamaStore';
import { createJSONStorage, persist } from "zustand/middleware";
import { MessageType } from "@flyerhq/react-native-chat-ui";
import { v4 as uuidv4 } from 'uuid';

import { MessageRole } from "@/chatutil/OllamaApi";
import { useSnackBarStore } from "./useSnackbar";

const STORAGE_KEY = '@ollama_chat_history';

// common Message for Both chat UI and ollama
export type CommonMessage = MessageType.Any & { role: MessageRole, loading?: boolean }

export interface Chat {
  messages: CommonMessage[];
  model: string;
  id: string;
  title: string;
  createdAt: Date
}

export interface ChatState {
  chats: Chat[];
  messages: CommonMessage[];
  isSending: boolean;
  error: string | null;
  initializeChats: () => Promise<void>;
  getMessages: (chatId?: string) => Promise<void>;
  saveMessages: (messages: CommonMessage[]) => Promise<void>;
  sendMessage: (message: MessageType.Any) => void;
  clearError: () => void;
}

const getOllamaMessageFromChatMessage = (messages: CommonMessage[]): Message[] => {

  return messages.map(message => {
    const { role = MessageRole.ASSISTANT, type = "text" } = message
    switch (type) {
      case "text":
        return ({
          role: role,
          content: message.text!
        })

      case "image":
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
  })
}

export const getChatMessageFromOllamaResponse = (ollamaResponse: ChatResponse): CommonMessage => {
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

export const getAssistantMessage = (text: string): CommonMessage => {
  return {
    id: uuidv4(),
    text,
    createdAt: Date.now(),
    author: {
      id: MessageRole.ASSISTANT,
    },
    type: 'text',
    role: MessageRole.ASSISTANT
  };
};

export const getSystemMessage = (text: string): CommonMessage => {
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

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  messages: [],
  isSending: false,
  error: null,

  initializeChats: async () => {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEY);
      if (history) {
        set({ messages: JSON.parse(history) as CommonMessage[] });
      }
    } catch (error) {
      set({ error: 'Error loading chat history' });
    }
  },

  getMessages: async (chatId?: string) => {
    try {
      const messages = await AsyncStorage.getItem(STORAGE_KEY) as unknown as CommonMessage[];
      set({ messages });
    } catch (error) {
      set({ messages: [] });
    }
  },
  saveMessages: async (messages: CommonMessage[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      set({ error: 'Error saving chat history' });
    }
  },

  sendMessage: async (message: MessageType.Any) => {
    const model = useOllamaStore.getState().selectedModel!
    if (!model) {
      useSnackBarStore.getState().setSnack({
        visible: true,
        message: "please pick a model to chat"
      });
      return
    }
    const currentMessages = get().messages;

    const updatedMessages = [{ ...message, loading: true, role: MessageRole.USER }, ...currentMessages];

    set({ messages: updatedMessages, isSending: true });

    try {
      const messages = getOllamaMessageFromChatMessage(updatedMessages);

      const response = await useOllamaStore.getState().ollama.chat({
        model,
        stream: false,
        messages,
      });

      if (response?.done) {
        const [lastmessage, ...currentMessages] = get().messages;
        const ollamaMessage = getChatMessageFromOllamaResponse(response)
        set({ messages: [ollamaMessage, { ...lastmessage, loading: false }, ...currentMessages], isSending: true });
      }
    } catch (error) {
      set({ error: 'Error generating response' });
    } finally {
      set({ isSending: false });
    }
  },
  clearError: () => set({ error: null }),
}));

export default useChatStore;