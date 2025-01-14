// import { ollama } from "@/util/OllamaApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { produce } from "immer"

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
  userId:string;
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
  chats: [] as Chat[],
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
      if (chat) {
        set({ chat: { ...chat, messages: chat.messages.filter(message => message.role != MessageRole.SYSTEM) || [] } });
        useOllamaStore.getState().setSelectedModel(chat.model)
      } else {
        set({ chat: undefined });
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

    const chat = get().chat!;

    const nextChat = produce(chat, draft => {
      draft.messages = [{ ...message, loading: true, role: MessageRole.USER }, ...draft.messages]
    })

    set({ chat: nextChat, isSending: true });

    try {
      const messages = getOllamaMessageFromChatMessage(nextChat.messages);

      const response = await useOllamaStore.getState().ollama.chat({
        model,
        stream: false,
        messages,
      });

      if (response?.done) {
        const ollamaMessage = getAssistantMessageFromOllama(response)

        const chat = get().chat!;
        const nextChat = produce(chat, draft => {
          const [lastmessage, ...currentMessages] = draft.messages!;
          draft.messages = [ollamaMessage, { ...lastmessage, loading: false }, ...currentMessages]
        })
        // set isSending false while the response is returnedj
        set({ chat: nextChat, isSending: false });

        const config = useConfigStore.getState().config

        if (config.generateTitles) {
          const title = await getTitleAi(get().chat!.messages)
          set({ chat: { ...get().chat!, title } });
        }
        get().saveChat()
      }
    } catch (error) {
      set({ error: 'Error generating response' });
      const nextChat = produce(get().chat!, draft => {
        draft.messages![draft.messages.length - 1].loading = false
      })
      set({ chat: nextChat });
    } finally {
      set({ isSending: false });
    }
  },
  clearError: () => set({ error: null }),

}));

export default useChatStore;