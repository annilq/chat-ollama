// import { ollama } from "@/chatutil/OllamaApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message } from "ollama";
import { create } from "zustand";
import { useOllamaStore } from './useOllamaStore';
import { createJSONStorage, persist } from "zustand/middleware";
import { MessageType } from "@flyerhq/react-native-chat-ui";
import { v4 as uuidv4 } from 'uuid';

import data from '../message.json'
import { MessageRole } from "@/chatutil/OllamaApi";

const STORAGE_KEY = '@ollama_chat_history';

// common Message for Both chat UI and ollama
type CommonMessage = MessageType.Any & { role: MessageRole }

export interface Chat {
  messages: CommonMessage[];
  model: string;
  id: string;
  title: string;
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
    // set({ isSending: true });
    const currentMessages = get().messages;

    const updatedMessages = [{ ...message, role: MessageRole.USER }, ...currentMessages];

    set({ messages: updatedMessages });

    try {
      const messages = getOllamaMessageFromChatMessage(updatedMessages);

      const response = await useOllamaStore.getState().ollama.chat({
        model,
        stream: false,
        messages,
        // onData: (data) => {
        //   console.log(data);

        //   try {

        //     set((state) => {
        //       const currentMessages = [...state.messages];
        //       const lastMessage = currentMessages[currentMessages.length - 1];

        //       if (lastMessage && lastMessage.role === 'assistant') {
        //         lastMessage.content = streamResponse;
        //       } else {
        //         currentMessages.push({ role: 'assistant', content: content.toString() });
        //       }

        //       return { messages: currentMessages };
        //     });

        //   } catch (error) {
        //     set({ error: 'Error parsing response' });
        //   }

        // },
        // onDataEnd: () => {

        // }
      });
      console.log(response);
      if (response?.done) {
        const { message } = response
        const assistantMessage: CommonMessage = {
          text: message.content,
          role: MessageRole.ASSISTANT,
          createdAt: new Date(response.created_at).getMilliseconds(),
          type: "text",
          id: uuidv4(),
          author: {
            id: model
          }
        }
        const currentMessages = get().messages;
        const updatedMessages = [assistantMessage, ...currentMessages];

        set({ messages: updatedMessages });
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