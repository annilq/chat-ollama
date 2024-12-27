import { Ollama } from 'ollama'

export const ollamaClient = new Ollama({ host: 'http://127.0.0.1:11434' })

export enum MessageRole {
  SYSTEM = "system",
  USER = "user",
  ASSISTANT = "assistant"
}
// const response = await ollama.chat({
//   model: 'llama3.1',
//   messages: [{ role: 'user', content: 'Why is the sky blue?' }],
// })


export const generateChatCompletion = async () => {

}

export const generateChatCompletionStream = async (p0: { messages: { role: string; content: string }[] }) => {

}