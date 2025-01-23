import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { storage } from '@/util/storage';
import { Appearance } from 'react-native';
import { getLocales } from 'expo-localization';

const colorScheme = Appearance.getColorScheme();

export const noMarkdownPrompt = "\nYou must not use markdown or any other formatting language in any way!";

const DEFAULT_PROMPT = "You are a helpful assistant"

export type RequestType = "stream" | "generate"
export type theme = "dark" | "light"

interface Config {
  // setting page config
  systemPrompt: string
  useSystem: boolean
  noMarkdown: boolean
  // chat config
  generateTitles: boolean
  requestType: RequestType // react native fetch doesn't support stream
  messageEditable: boolean
  clearChatWhenResetModel: boolean
  showConfirmWhenChatDelete: boolean
  timeoutTimes: number
  // UI
  locale: string,
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
        noMarkdown: false,

        generateTitles: true,
        requestType: "stream",
        messageEditable: true,
        clearChatWhenResetModel: false,
        showConfirmWhenChatDelete: true,
        timeoutTimes: 1,

        showTipsInDrawer: true,
        locale: getLocales()[0].languageCode!,// Set the locale once at the beginning of your app.
        showModelTag: false,
        theme: colorScheme!,
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