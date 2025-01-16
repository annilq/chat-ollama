import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { storage } from '@/util/storage';

const noMarkdownPrompt = "\nYou must not use markdown or any other formatting language in any way!";


const DEFAULT_PROMPT = "You are a helpful assistant"

export type RequestType = "stream" | "generate"
export type theme = "dark" | "light" | "system"

interface Config {
  // setting page config
  systemPrompt: string
  useSystem: boolean
  useMarkdown: boolean
  // chat config
  generateTitles: boolean
  requestType: RequestType // react native fetch doesn't support stream
  messageEditable: boolean
  clearChatWhenResetModel: boolean
  showConfirmWhenChatDelete: boolean
  timeoutTimes: number
  // UI
  showTipsInDrawer: boolean
  showModelTag: boolean
  theme: "dark" | "light" | "system"
  enableHaptic: boolean

}

export interface ConfigState {
  config: Config
  setConfig: (config: Partial<Config>) => void;
}

export const useConfigStore = create(
  persist<ConfigState>(
    (set, get) => ({
      config: {
        useSystem: false,
        systemPrompt: DEFAULT_PROMPT,
        useMarkdown: false,

        generateTitles: true,
        requestType: "generate",
        messageEditable: true,
        clearChatWhenResetModel: false,
        showConfirmWhenChatDelete: true,
        timeoutTimes: 1,

        showTipsInDrawer: true,
        showModelTag: false,
        theme: "system",
        enableHaptic: true
      },
      setConfig: (config) => set({ config: { ...(get().config), ...config } }),
    }),
    {
      name: 'app-config',
      storage: createJSONStorage(() => storage),
    },
  ),
)