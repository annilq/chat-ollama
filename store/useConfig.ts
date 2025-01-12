import { create } from 'zustand'
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware'
import AsyncStorage from "@react-native-async-storage/async-storage";

// Custom storage object
const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> => {
    console.log(name, 'has been retrieved')
    return (await AsyncStorage.getItem(name)) || null
  },
  setItem: async (name: string, value: string): Promise<void> => {
    console.log(name, 'with value', value, 'has been saved')
    await AsyncStorage.setItem(name, value)
  },
  removeItem: async (name: string): Promise<void> => {
    console.log(name, 'has been deleted')
    await AsyncStorage.removeItem(name)
  },
}

interface Config {
  format: string
  generateTitles: boolean
}

export interface ConfigState {
  config: Config
  setConfig: (config: Partial<Config>) => void;
}

export const useConfigStore = create(
  persist<ConfigState>(
    (set, get) => ({
      config: { format: "", generateTitles: true },
      setConfig: (config) => set({ config: { ...(get().config), ...config } }),
    }),
    {
      name: 'app-config',
      storage: createJSONStorage(() => storage),
    },
  ),
)