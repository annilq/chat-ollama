import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import OllamaAPI from './OllamaApi';

// Base types
interface ModelInfo {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: Record<string, any>;
}

// Provider props interface
interface OllamaProviderProps {
  children: React.ReactNode;
  host?: string;
  healthCheckInterval?: number;
}

// Context state interface
interface OllamaContextState {
  models: ModelInfo[];
  selectedModel: string | null;
  isLoading: boolean;
  error: Error | null;
  isServiceAvailable: boolean;
}

// Context value interface (extends state with methods)
interface OllamaContextValue extends OllamaContextState {
  setSelectedModel: (modelName: string) => void;
  refreshModels: () => Promise<void>;
  pullModel: (modelName: string) => Promise<void>;
  deleteModel: (modelName: string) => Promise<void>;
  getModelInfo: (modelName: string) => Promise<ModelInfo>;
  checkService: () => Promise<boolean>;
}

const OllamaContext = createContext<OllamaContextValue | null>(null);

export const OllamaProvider: React.FC<OllamaProviderProps> = ({ 
  children, 
  host = 'http://localhost:11434',
  healthCheckInterval = 10000  // Check every 30 seconds by default
}) => {
  const [state, setState] = useState<OllamaContextState>({
    models: [],
    selectedModel: null,
    isLoading: true,
    error: null,
    isServiceAvailable: false
  });

  const ollama = React.useMemo(() => new OllamaAPI(host), [host]);

  const checkService = useCallback(async () => {
    const isAvailable = await ollama.checkHealth();
    setState(prev => ({ ...prev, isServiceAvailable: isAvailable }));
    return isAvailable;
  }, [ollama]);
  // Initial service check and periodic health check
  useEffect(() => {
    checkService();
    
    const interval = setInterval(checkService, healthCheckInterval);
    
    return () => clearInterval(interval);
  }, [checkService, healthCheckInterval]);

  // Modified refreshModels to check service status first
  const refreshModels = useCallback(async () => {
    try {
      const isAvailable = await checkService();
      if (!isAvailable) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          error: new Error('Ollama service is not available')
        }));
        return;
      }

      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const response = await ollama.list();
      setState(prev => ({
        ...prev,
        models: response.models,
        isLoading: false,
        selectedModel: prev.selectedModel || (response.models[0]?.name ?? null)
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Unknown error occurred')
      }));
    }
  }, [ollama, checkService]);

  const pullModel = useCallback(async (modelName: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await ollama.pull({ name: modelName });
      await refreshModels();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to pull model')
      }));
    }
  }, [ollama, refreshModels]);

  const deleteModel = useCallback(async (modelName: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      await ollama.deleteModel(modelName);
      if (state.selectedModel === modelName) {
        setState(prev => ({ ...prev, selectedModel: null }));
      }
      await refreshModels();
    } catch (error) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Failed to delete model')
      }));
    }
  }, [ollama, refreshModels, state.selectedModel]);

  const getModelInfo = useCallback(async (modelName: string) => {
    return ollama.modelInfo(modelName);
  }, [ollama]);

  const setSelectedModel = useCallback((modelName: string) => {
    setState(prev => ({ ...prev, selectedModel: modelName }));
  }, []);

  // Initialize models on mount
  useEffect(() => {
    refreshModels();
  }, [refreshModels]);

  const value: OllamaContextValue = {
    ...state,
    setSelectedModel,
    refreshModels,
    pullModel,
    deleteModel,
    getModelInfo,
    checkService,
  };

  return (
    <OllamaContext.Provider value={value}>
      {children}
    </OllamaContext.Provider>
  );
};

// Custom hook to use the Ollama context
export const useOllama = () => {
  const context = useContext(OllamaContext);
  if (!context) {
    throw new Error('useOllama must be used within an OllamaProvider');
  }
  return context;
};

// Type exports
export type { 
  ModelInfo, 
  OllamaContextValue, 
  OllamaProviderProps,
  OllamaContextState 
};