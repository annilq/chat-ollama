// import { ollama } from "@/util/OllamaApi";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { produce } from "immer"

import { v4 as uuidv4 } from 'uuid';

import { useOllamaStore } from './useOllamaStore';
import { MessageType } from "@flyerhq/react-native-chat-ui";

import { MessageRole } from "@/util/ollama_api";
import { useSnackBarStore } from "./useSnackbar";
import { getOllamaMessageFromChatMessage, getAssistantMessageFromOllama, getTitleAi, getSystemMessage } from "@/util/util";
import { noMarkdownPrompt, useConfigStore } from "./useConfig";
import { i18n } from '@/util/l10n/i18n';
import { ChatResponse } from "ollama";

export const CHAT_STORAGE_KEY = '@ollama_chat_history';

interface Metadata {
  text: string
}
// common Message for Both chat UI and ollama
export type CommonMessage = MessageType.Any & { role: MessageRole, loading?: boolean, metadata?: Metadata }

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
  setModel: (modelName: string) => void;
  editMessageId: string | false
  isSending: boolean;
  error: string | null;
  initializeChats: () => Promise<void>;
  handleOllamaResponse: (response: ChatResponse, messageId: string) => void;
  updateChat: () => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  showMessageInput: (messageId: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  updateMessage: (messageId: string, message: string) => Promise<void>;
  getChat: (chatId?: string) => Promise<void>;
  saveCurrentChat: () => Promise<void>;
  sendMessage: (message: CommonMessage) => void;
  clearError: () => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  chats: [] as Chat[],
  chat: undefined,
  messages: [],
  editMessageId: false,
  isSending: false,
  error: null,

  initializeChats: async () => {
    const history = await AsyncStorage.getItem(CHAT_STORAGE_KEY);
    if (history) {
      set({ chats: JSON.parse(history) as Chat[] });
    }
  },
  setModel: (modelName) => {
    const clearChatWhenResetModel = useConfigStore.getState().config.clearChatWhenResetModel
    const chat = get().chat!
    if (clearChatWhenResetModel) {
      set({ chat: { ...chat, model: modelName, messages: [] } });
    } else {
      set({ chat: { ...chat, model: modelName } });
    }
  },
  getChat: async (chatId?: string) => {
    try {
      const chats: Chat[] = get().chats
      const chat = chats.find(chat => chat.id === chatId)
      if (chat) {
        set({ chat });
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

  showMessageInput: async (messageId: string) => {
    try {
      set({ editMessageId: messageId })
    } catch (error) {
    }
  },

  updateMessage: async (messageId: string, message: string) => {
    try {
      const { chat } = get()
      const nextChat = produce(chat!, draft => {
        const messageIndex = draft.messages.findIndex(message => message.id === messageId)
        if (draft.messages[messageIndex].type === "text") {
          draft.messages[messageIndex].text = message
        } else if (draft.messages[messageIndex].type === "image") {
          draft.messages[messageIndex].metadata = { text: message }
        }
      })
      set({ chat: nextChat, editMessageId: false })

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

  handleOllamaResponse: async (response: ChatResponse, messageId: string) => {
    const { config } = useConfigStore.getState()

    const isStream = config.requestType === "stream";
    const showLoading = !response.done && !isStream

    const chat = get().chat!;

    const message = getAssistantMessageFromOllama(response, messageId)

    const nextChat = produce(chat, draft => {
      const lastmessage = draft.messages[0]
      // if response is streaming
      // now we store image vision info to 
      if (lastmessage.id === message.id) {
        if (draft.messages[1]?.type === "image") {
          draft.messages[1].metadata = { text: message.text }
        }
        draft.messages[1].loading = showLoading
        draft.messages[0] = message
      } else {
        if (lastmessage.type === "image") {
          draft.messages[0].metadata = { text: message.text }
        }
        draft.messages[0].loading = showLoading
        draft.messages = [message, ...draft.messages]
      }
    })
    // set isSending false while the response is returnedj
    set({ chat: nextChat, isSending: !response.done });
  },

  sendMessage: async (message: CommonMessage) => {
    const { config } = useConfigStore.getState()
    const model = get().chat?.model
    if (!model) {
      useSnackBarStore.getState().setSnack({
        visible: true,
        message: i18n.t("noModelSelected")
      });
      return
    }

    if (!get().chat?.messages) {
      let systemPrompt = config.systemPrompt
      if (config.noMarkdown) {
        systemPrompt = systemPrompt + noMarkdownPrompt
      }
      set({
        chat: {
          // Todo do show system message  
          messages: config.useSystem ? [getSystemMessage(systemPrompt)] : [],
          userId: message.author.id,
          title: "",
          model,
          createdAt: new Date,
          id: uuidv4()
        }
      })
    }

    const chat = get().chat!;
    const nextChat = produce(chat, draft => {
      draft.messages = [{ ...message, loading: config.requestType === "stream" ? false : true, role: MessageRole.USER }, ...draft.messages]
    })

    set({ chat: nextChat, isSending: true });

    try {
      const messages = getOllamaMessageFromChatMessage(nextChat.messages);
      //  streaming response share messageId
      const messageId = uuidv4()
      const response = await useOllamaStore.getState().ollama.chat(
        {
          model,
          stream: config.requestType === "stream",
          messages,
        },
        (streamResponse) => {
          get().handleOllamaResponse(streamResponse, messageId)
        }
      );
      if (response?.done) {
        get().handleOllamaResponse(response, messageId)

        if (config.generateTitles) {
          const title = await getTitleAi(get().chat!.messages)
          set({ chat: { ...get().chat!, title } });
        } else {
          // use the first message for title
          const firstUserMessage = chat!.messages.find(message => message.role === MessageRole.USER)!
          set({ chat: { ...get().chat!, title: firstUserMessage.type == "text" ? firstUserMessage.text : firstUserMessage.metadata?.text! } });
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