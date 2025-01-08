// import { ollama } from "@/chatutil/OllamaApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Message } from "ollama";
import { create } from "zustand";
import { useOllamaStore } from './useOllamaStore';
import { createJSONStorage, persist } from "zustand/middleware";


const STORAGE_KEY = '@ollama_chat_history';

export interface Chat {
  messages: Message[];
  model: string;
  id: string;
  title: string;
}
export interface ChatState {
  chats: Chat[];
  messages: Message[];
  isSending: boolean;
  error: string | null;
  initializeChats: () => Promise<void>;
  getMessages: (chatId?: string) => Promise<void>;
  saveMessages: (messages: Message[]) => Promise<void>;
  sendMessage: (userInput: string) => Promise<void>;
  clearError: () => void;
}

const useChatStore = create<ChatState>()(persist((set, get) => ({
  chats: [],
  messages: [],
  isSending: false,
  error: null,

  initializeChats: async () => {
    try {
      const history = await AsyncStorage.getItem(STORAGE_KEY);
      if (history) {
        set({ messages: JSON.parse(history) as Message[] });
      }
    } catch (error) {
      set({ error: 'Error loading chat history' });
    }
  },

  getMessages: async (chatId?: string) => {
    try {
      const messages = await AsyncStorage.getItem(STORAGE_KEY) as unknown as Message[];
      set({ messages });
    } catch (error) {
      set({ messages: [] });
    }
  },
  saveMessages: async (messages: Message[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (error) {
      set({ error: 'Error saving chat history' });
    }
  },
  sendMessage: async (userInput: string) => {
    if (!userInput.trim()) return;

    set({ isSending: true });
    const currentMessages = get().messages;
    const userMessage: Message = { role: 'user', content: userInput };
    const updatedMessages = [...currentMessages, userMessage];

    set({ messages: updatedMessages });

    try {
      
      const response = await useOllamaStore.getState().ollama.chat({
        model: useOllamaStore.getState().selectedModel!,
        stream: true,
        messages: updatedMessages,
        onData: (data) => {

          // try {

          //   set((state) => {
          //     const currentMessages = [...state.messages];
          //     const lastMessage = currentMessages[currentMessages.length - 1];

          //     if (lastMessage && lastMessage.role === 'assistant') {
          //       lastMessage.content = streamResponse;
          //     } else {
          //       currentMessages.push({ role: 'assistant', content: content.toString() });
          //     }

          //     return { messages: currentMessages };
          //   });

          // } catch (error) {
          //   set({ error: 'Error parsing response' });
          // }

        },
        onDataEnd: () => {

        }
      },
      );

    } catch (error) {
      set({ error: 'Error generating response' });
    } finally {
      set({ isSending: false });
    }
  },
  clearError: () => set({ error: null }),
}), {
  name: 'chatStore',
  storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
},));

export default useChatStore;