// import { create } from 'zustand';
// import { useSnackBarStore } from './useSnackbar';
// import { ModelResponse, ShowResponse } from "ollama";

// import Ollama from 'ollama/dist/browser';

// let ollama: Ollama

// interface OllamaState {
//   models: ModelResponse[];
//   selectedModel: string | null;
//   isLoading: boolean;
//   error: Error | null;
//   isServiceAvailable: boolean;

//   // Actions
//   setSelectedModel: (modelName: string) => void;
//   refreshModels: () => Promise<void>;
//   pullModel: (modelName: string) => Promise<void>;
//   deleteModel: (modelName: string) => Promise<void>;
//   getModelInfo: (modelName: string) => Promise<ShowResponse>;
//   checkService: () => Promise<boolean>;
//   initialize: (host?: string) => void;
// }

// export const useOllamaStore = create<OllamaState>((set, get) => ({
//   models: [],
//   selectedModel: null,
//   isLoading: true,
//   error: null,
//   isServiceAvailable: false,

//   initialize: (host = 'http://localhost:11434') => {
//     ollama = Ollama;
//     get().checkService();
//     get().refreshModels();
//   },

//   setSelectedModel: (modelName) => {
//     set({ selectedModel: modelName });
//   },

//   checkService: async () => {
//     try {
//       await ollama.list();
//       set({ isServiceAvailable: true });
//       return true;
//     } catch (error) {
//       set({ isServiceAvailable: false });
//       return false;
//     }
//   },

//   refreshModels: async () => {
//     try {
//       const isAvailable = await get().checkService();
//       if (!isAvailable) {
//         set({
//           isLoading: false,
//           error: new Error('Ollama service is not available')
//         });
//         useSnackBarStore.getState().setSnack({
//           visible: true,
//           message: 'Ollama service is not available'
//         });
//         return;
//       }

//       set({ isLoading: true, error: null });
//       const models = await ollama.list();
//       set((state) => ({
//         models: models.models,
//         isLoading: false,
//         selectedModel: state.selectedModel || models.models[0]?.name || null
//       }));
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
//       set({
//         isLoading: false,
//         error: error instanceof Error ? error : new Error(errorMessage)
//       });
//       useSnackBarStore.getState().setSnack({
//         visible: true,
//         message: errorMessage
//       });
//     }
//   },

//   pullModel: async (modelName) => {
//     try {
//       set({ isLoading: true, error: null });
//       await ollama.pull({ model: modelName });
//       await get().refreshModels();
//       useSnackBarStore.getState().setSnack({
//         visible: true,
//         message: `Successfully pulled model ${modelName}`
//       });
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to pull model';
//       set({
//         isLoading: false,
//         error: error instanceof Error ? error : new Error(errorMessage)
//       });
//       useSnackBarStore.getState().setSnack({
//         visible: true,
//         message: errorMessage
//       });
//     }
//   },

//   deleteModel: async (modelName) => {
//     try {
//       set({ isLoading: true, error: null });
//       await ollama.delete({ model: modelName });
//       set((state) => ({
//         selectedModel: state.selectedModel === modelName ? null : state.selectedModel
//       }));
//       await get().refreshModels();
//       useSnackBarStore.getState().setSnack({
//         visible: true,
//         message: `Successfully deleted model ${modelName}`
//       });
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : 'Failed to delete model';
//       set({
//         isLoading: false,
//         error: error instanceof Error ? error : new Error(errorMessage)
//       });
//       useSnackBarStore.getState().setSnack({
//         visible: true,
//         message: errorMessage
//       });
//     }
//   },

//   getModelInfo: async (modelName) => {
//     return ollama.show({ model: modelName });
//   },
// }));