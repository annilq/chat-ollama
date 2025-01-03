import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'

interface MessageState {
  messages: number
  setMessage: (by: number) => void
}

export const useMessageStore = create<MessageState>()(
  devtools(
    persist(
      (set) => ({
        messages: 0,
        setMessage: (by) => set((state) => ({ messages: state.messages + by })),
      }),
      { name: 'messageStore' },
    ),
  ),
)
