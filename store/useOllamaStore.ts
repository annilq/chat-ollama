import { create } from 'zustand';
import OllamaAPI from '@/util/ollama_api';
import { useSnackBarStore } from './useSnackbar';
import { ModelResponse } from "ollama";
import { i18n } from '@/util/l10n/i18n';
import { useConfigStore } from './useConfig';

interface OllamaState {
  models: ModelResponse[];
  isLoading: boolean;
  error: Error | null;
  isServiceAvailable: boolean;
  ollama: OllamaAPI;

  // Actions
  refreshModels: () => Promise<void>;
  pullModel: (modelName: string) => Promise<void>;
  deleteModel: (modelName: string) => Promise<void>;
  getModelInfo: (modelName: string) => Promise<ModelResponse>;
  checkService: () => Promise<boolean>;
  initialize: (host?: string) => void;
}

export const useOllamaStore = create<OllamaState>((set, get) => ({
  models: [],
  isLoading: true,
  error: null,
  isServiceAvailable: false,
  ollama: new OllamaAPI(),

  initialize: (host = 'http://localhost:11434') => {
    const ollama = new OllamaAPI(host);
    set({ ollama });
    get().checkService();
    get().refreshModels();
  },

  checkService: async () => {
    const isAvailable = await get().ollama.checkHealth();
    set({ isServiceAvailable: isAvailable });
    return isAvailable;
  },

  refreshModels: async () => {
    try {
      const isAvailable = await get().checkService();
      if (!isAvailable) {
        set({
          isLoading: false,
          error: new Error('Ollama service is not available')
        });
        useSnackBarStore.getState().setSnack({
          visible: true,
          message: 'Ollama service is not available'
        });
        return;
      }

      set({ isLoading: true, error: null });
      const response = await get().ollama.list();
      set((state) => ({
        models: response.models,
        isLoading: false,
      }));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      set({
        isLoading: false,
        error: error instanceof Error ? error : new Error(errorMessage)
      });
      useSnackBarStore.getState().setSnack({
        visible: true,
        message: errorMessage
      });
    }
  },

  pullModel: async (modelName) => {
    try {
      set({ isLoading: true, error: null });
      await get().ollama.pull({ model: modelName });
      await get().refreshModels();
      useSnackBarStore.getState().setSnack({
        visible: true,
        message: i18n.t("modelDialogAddDownloadSuccess")
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to pull model';
      set({
        isLoading: false,
        error: error instanceof Error ? error : new Error(errorMessage)
      });
      useSnackBarStore.getState().setSnack({
        visible: true,
        message: errorMessage
      });
    }
  },

  deleteModel: async (modelName) => {
    try {
      set({ isLoading: true, error: null });
      await get().ollama.deleteModel(modelName);
      await get().refreshModels();
      useSnackBarStore.getState().setSnack({
        visible: true,
        message: `Successfully deleted model ${modelName}`
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete model';
      set({
        isLoading: false,
        error: error instanceof Error ? error : new Error(errorMessage)
      });
      useSnackBarStore.getState().setSnack({
        visible: true,
        message: errorMessage
      });
    }
  },

  getModelInfo: async (modelName) => {
    return get().ollama.modelInfo(modelName);
  },
}));