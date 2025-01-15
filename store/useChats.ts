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
  userId: string;
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
  updateChat: () => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  updateMessage: (messageId: string, message: CommonMessage) => Promise<void>;
  getChat: (chatId?: string) => Promise<void>;
  saveCurrentChat: () => Promise<void>;
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
      const chats: Chat[] = get().chats
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

  deleteChat: async (chatId: string) => {
    try {
      const chats: Chat[] = get().chats
      const updateChats = chats.filter(chat => chat.id !== chatId)
      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(updateChats));
      set({ chats: updateChats })
    } catch (error) {
    }
  },

  updateChat: async () => {
    const { chat, chats } = get()
    try {
      const nextChats = produce(chats, draft => {
        const chatIndex = draft.findIndex(item => item.id === chat!.id)
        draft[chatIndex] = chat!
      })

      await AsyncStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify(nextChats));
      set({ chat: chat, chats: nextChats })
    } catch (error) {
    }
  },

  deleteMessage: async (messageId: string) => {
    try {
      const { chat } = get()
      const nextChat = produce(chat!, draft => {
        draft.messages = draft.messages.filter(message => message.id !== messageId)
      })
      set({ chat: nextChat })
      get().updateChat()
    } catch (error) {
    }
  },

  updateMessage: async (messageId: string, message: CommonMessage) => {
    try {
      const { chat } = get()
      const nextChat = produce(chat!, draft => {
        const messageIndex = draft.messages.findIndex(message => message.id !== messageId)
        draft.messages[messageIndex] = message
      })
      set({ chat: nextChat })

      get().updateChat()

    } catch (error) {
    }
  },

  saveCurrentChat: async () => {
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
        const responseMessage = getAssistantMessageFromOllama(response)

        const chat = get().chat!;
        const nextChat = produce(chat, draft => {
          const [lastmessage, ...currentMessages] = draft.messages!;
          if (lastmessage.type === "image") {
            draft.messages = [
              // think if show the image response to user or just set the response to lastmessage.content
              // when user edit image ,it can update the vision result
              responseMessage,
              {
                ...lastmessage,
                metadata: { message: response.message.content },
                loading: false
              }, ...currentMessages
            ]
          } else {
            draft.messages = [responseMessage, { ...lastmessage, loading: false }, ...currentMessages]
          }
        })
        // set isSending false while the response is returnedj
        set({ chat: nextChat, isSending: false });

        const config = useConfigStore.getState().config

        if (config.generateTitles) {
          const title = await getTitleAi(get().chat!.messages)
          set({ chat: { ...get().chat!, title } });
        }
        get().saveCurrentChat()
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