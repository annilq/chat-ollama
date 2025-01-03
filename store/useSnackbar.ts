import { create } from 'zustand'

interface SnackBarState {
  visible: boolean
  message?: string
  setSnack: (config: { visible: boolean, message?: string }) => void
}

export const useSnackBarStore = create<SnackBarState>()((set) => ({
  visible: false,
  message: "",
  setSnack: (config) => set(() => ({ visible: config.visible, message: config.message })),
}))
