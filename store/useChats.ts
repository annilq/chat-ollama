import { create } from 'zustand'
import { createJSONStorage, devtools, persist } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MessageType } from '@flyerhq/react-native-chat-ui';

type Chat = MessageType.Any[]

interface ChatState {
  historyChats: Chat[]
  currentChat: Chat
  sending: boolean
  setChat: (by: number) => void
}

export const useChatStore = create<ChatState>()(
  devtools(
    persist(
      (set) => ({
        chats: [],
        sending: false,
        setChat: (by) => set((state) => ({ chats: state.chats + by })),
      }),
      {
        name: 'chatStore',
        storage: createJSONStorage(() => AsyncStorage), // (optional) by default, 'localStorage' is used
      },
    ),
  ),
)