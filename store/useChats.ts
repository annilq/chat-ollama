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

    let streamResponse = '';

    try {
      // const aborter = new AbortController();

      const response = await useOllamaStore.getState().ollama.chat({
        model: useOllamaStore.getState().selectedModel!,
        stream: true,
        messages: updatedMessages,
        // signal: aborter.signal
      },
      );
      const content: string[] = []
      // for await (const part of response) {
      //   content.push(part.message.content)
      // }

      // for await (const chunk of response.body) {
      //   if (signal.aborted) break; // just break out of loop
      //   // Do something with the chunk
      // }


      const reader = response.body?.getReader();
      if (!reader) throw new Error('Failed to get response reader');

      const decoder = new TextDecoder();
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.trim() === '') continue;

          try {
            const parsedChunk = JSON.parse(line);
            streamResponse += parsedChunk.response;

            set((state) => {
              const currentMessages = [...state.messages];
              const lastMessage = currentMessages[currentMessages.length - 1];

              if (lastMessage && lastMessage.role === 'assistant') {
                lastMessage.content = streamResponse;
              } else {
                currentMessages.push({ role: 'assistant', content: streamResponse });
              }

              return { messages: currentMessages };
            });

            if (parsedChunk.done) {
              const finalMessages = [...updatedMessages, { role: 'assistant', content: streamResponse }];
              set({ messages: finalMessages });
              get().saveMessages(finalMessages);
              break;
            }
          } catch (error) {
            set({ error: 'Error parsing response' });
          }
        }
      }
      try {

        set((state) => {
          const currentMessages = [...state.messages];
          const lastMessage = currentMessages[currentMessages.length - 1];

          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content = streamResponse;
          } else {
            currentMessages.push({ role: 'assistant', content: content.toString() });
          }

          return { messages: currentMessages };
        });

      } catch (error) {
        set({ error: 'Error parsing response' });
      }

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