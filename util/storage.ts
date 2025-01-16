import AsyncStorage from "@react-native-async-storage/async-storage"
import { StateStorage } from "zustand/middleware"

// Custom storage object
export const storage: StateStorage = {
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