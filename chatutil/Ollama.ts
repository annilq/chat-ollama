// Types for API responses and requests
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ChatRequest {
  model: string;
  messages: ChatMessage[];
  stream?: boolean;
  format?: string;
  options?: Record<string, any>;
}

export interface GenerateRequest {
  model: string;
  prompt: string;
  stream?: boolean;
  format?: string;
  options?: Record<string, any>;
}

export interface ModelInfo {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: Record<string, any>;
}

export interface PullRequest {
  name: string;
  insecure?: boolean;
  stream?: boolean;
}

class OllamaAPI {
  private baseURL: string;

  constructor(host: string = 'http://localhost:11434') {
    this.baseURL = host.replace(/\/$/, '');
  }

  private async fetchWithError(endpoint: string, options: RequestInit): Promise<any> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || `HTTP error! status: ${response.status}`);
      }

      return response;
    } catch (error) {
      console.error(`Error in Ollama API call to ${endpoint}:`, error);
      throw error;
    }
  }

  /**
   * Chat with a model using message history
   */
  async chat(request: ChatRequest): Promise<Response> {
    return this.fetchWithError('/api/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Generate a response from a prompt
   */
  async generate(request: GenerateRequest): Promise<Response> {
    return this.fetchWithError('/api/generate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * List all available models
   */
  async list(): Promise<{ models: ModelInfo[] }> {
    const response = await this.fetchWithError('/api/tags', {
      method: 'GET',
    });
    return response.json();
  }

  /**
   * Pull a model from the Ollama library
   */
  async pull(request: PullRequest): Promise<Response> {
    return this.fetchWithError('/api/pull', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  /**
   * Get information about a specific model
   */
  async modelInfo(modelName: string): Promise<ModelInfo> {
    const response = await this.fetchWithError('/api/show', {
      method: 'POST',
      body: JSON.stringify({ name: modelName }),
    });
    return response.json();
  }

  /**
   * Delete a model
   */
  async deleteModel(modelName: string): Promise<void> {
    await this.fetchWithError('/api/delete', {
      method: 'DELETE',
      body: JSON.stringify({ name: modelName }),
    });
  }

  /**
   * Copy a model
   */
  async copyModel(source: string, destination: string): Promise<void> {
    await this.fetchWithError('/api/copy', {
      method: 'POST',
      body: JSON.stringify({ source, destination }),
    });
  }

  /**
   * Create a model from a Modelfile
   */
  async createModel(modelName: string, modelfile: string): Promise<void> {
    await this.fetchWithError('/api/create', {
      method: 'POST',
      body: JSON.stringify({ name: modelName, modelfile }),
    });
  }
}



// // 初始化客户端
const ollama = new OllamaAPI('http://localhost:11434');

// // 聊天示例
// const chatResponse = await ollama.chat({
//   model: 'llama2',
//   messages: [
//     { role: 'user', content: 'Hello, how are you?' }
//   ]
// });

// // 生成文本
// const generateResponse = await ollama.generate({
//   model: 'llama2',
//   prompt: 'Write a story about a space adventure'
// });

// // 列出所有模型
// const models = await ollama.list();

// // 下载新模型
// await ollama.pull({
//   name: 'llama2'
// });

// // 获取模型信息
// const modelInfo = await ollama.modelInfo('llama2');


export default ollama;