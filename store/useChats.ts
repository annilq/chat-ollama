// import { ollama } from "@/util/OllamaApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { v4 as uuidv4 } from 'uuid';

import { useOllamaStore } from './useOllamaStore';
import { createJSONStorage, persist } from "zustand/middleware";
import { MessageType } from "@flyerhq/react-native-chat-ui";

import { MessageRole } from "@/util/ollama_api";
import { useSnackBarStore } from "./useSnackbar";
import { getOllamaMessageFromChatMessage, getAssistantMessageFromOllama, getTitleAi } from "@/util/util";
import { useConfigStore } from "./useConfig";

const CHAT_STORAGE_KEY = '@ollama_chat_history';

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
  chat?: Chat;
  useSystem?: Boolean;
  isSending: boolean;
  error: string | null;
  initializeChats: () => Promise<void>;
  getChat: (chatId?: string) => Promise<void>;
  saveChat: () => Promise<void>;
  sendMessage: (message: MessageType.Any) => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [],
  useSystem: false,
  chat: undefined,
  messages: [],
  isSending: false,
  error: null,

  initializeChats: async () => {
    const history = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
    if (history) {
      set({ chats: JSON.parse(history) as Chat[] });
    }
  },

  getChat: async (chatId?: string) => {
    try {
      const chats = get().chats
      const chat = chats.find(chat => chat.id === chatId)
      console.log(chat);

      if (chat) {
        set({ chat: { ...chat, messages: chat.messages.filter(message => message.role != MessageRole.SYSTEM) || [] } });
      }
    } catch (error) {
    }
  },

  saveChat: async () => {
    const { chat, chats } = get()!
    try {
      const index = chats.findIndex(item => item.id === chat?.id)
      if (index > -1) {
        chats.splice(index, 1, chat!);
      } else {
        chats.push(chat!)
      }
      console.log(chats);

      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(chats));
      set({ chats })
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
    if (!get().chat) {
      set({
        chat: {
          messages: get().useSystem ? [{ role: MessageRole.SYSTEM, text: "", id: uuidv4(), type: "text", author: { id: MessageRole.SYSTEM } }] : [],
          title: "",
          model,
          createdAt: new Date,
          id: uuidv4()
        }
      })
    }
    const currentMessages = get().chat!.messages;

    const updatedMessages = [{ ...message, loading: true, role: MessageRole.USER }, ...currentMessages];

    set({ chat: { ...get().chat!, messages: updatedMessages }, isSending: true });

    try {
      const messages = getOllamaMessageFromChatMessage(updatedMessages);

      const response = await useOllamaStore.getState().ollama.chat({
        model,
        stream: false,
        messages,
      });

      if (response?.done) {
        const [lastmessage, ...currentMessages] = get().chat?.messages!;
        const ollamaMessage = getAssistantMessageFromOllama(response)
        const updatedMessages = [ollamaMessage, { ...lastmessage, loading: false }, ...currentMessages]
        set({ chat: { ...get().chat!, messages: updatedMessages } });
        
        const config = useConfigStore.getState().config

        if (config.generateTitles) {
          const title = await getTitleAi(updatedMessages)
          set({ chat: { ...get().chat!, title } });
        }
        get().saveChat()
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