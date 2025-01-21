import { v4 as uuidv4 } from 'uuid';

import { MessageRole } from './ollama_api';
import { ChatResponse, Message } from 'ollama';
import useChatStore, { CommonMessage } from '@/store/useChats';
import { useOllamaStore } from '@/store/useOllamaStore';
import { MessageType } from '@flyerhq/react-native-chat-ui';

// Function to get the title from AI
async function getTitleAi(messages: CommonMessage[]): Promise<string> {
  try {
    // Mocking the API call using axios (Replace with your actual endpoint and payload)
    const model = useChatStore.getState().chat?.model!
    const generatedResponse = await useOllamaStore.getState().ollama.chat({
      model,
      stream: false,
      messages: [
        {
          role: 'system',
          content: `Generate a three to six word title for the conversation provided by the user. If an object or person is very important in the conversation, put it in the title as well; keep the focus on the main subject. You must not put the assistant in the focus and you must not put the word 'assistant' in the title! Do preferably use title case. Use a formal tone, don't use dramatic words, like 'mystery' Use spaces between words, do not use camel case! You must not use markdown or any other formatting language! You must not use emojis or any other symbols! You must not use general clauses like 'assistance', 'help' or 'session' in your title! \n\n~~User Introduces Themselves~~ -> User Introduction\n~~User Asks for Help with a Problem~~ -> Problem Help\n~~User has a _**big**_ Problem~~ -> Big Problem`
        },
        {
          role: 'user',
          content: messages.map(message => message.text || message.metadata?.text).join('\n')
        }
      ]
    });
    console.log(generatedResponse);
    if (!generatedResponse?.done) {
      return messages[messages.length - 1].text
    }

    let title = generatedResponse?.message.content!;
    title = title.replaceAll("\n", " ");

    const terms = [
      "\"", "'", "*", "_", ".", ",", "!", "?", ":", ";", "(", ")", "[", "]", "{", "}"
    ];

    terms.forEach(term => {
      title = title.replaceAll(term, "");
    });

    title = title.replaceAll(/<.*?>/g, ""); // Remove HTML tags
    if (title.split(":").length === 2) {
      title = title.split(":")[1];
    }

    while (title.includes("  ")) {
      title = title.replaceAll("  ", " ");
    }

    return title.trim();
  } catch (error) {
    console.error("Error in getTitleAi: ", error);
    return '';
  }
}

const getOllamaMessageFromChatMessage = (messages: CommonMessage[]): Message[] => {

  return messages.map(message => {
    const { role = MessageRole.ASSISTANT, type = "text" } = message
    switch (type) {
      case "text":
        return ({
          role: role,
          content: (message as MessageType.Text).text!
        })

      case "image":
        // split base64
        const base64 = (message as MessageType.Image).uri.split("base64,")[1]
        return ({
          role: role,
          content: "",
          images: [base64]
        })
      case "file":
        return ({
          role: role,
          content: "",
          images: [message.uri]
        })
      case "unsupported":
        return ({
          role: role,
          content: ""
        })

      case "custom":
        return ({
          role: role,
          content: ""
        })
    }
  }).reverse()
}

const getAssistantMessageFromOllama = (ollamaResponse: ChatResponse): CommonMessage => {
  return {
    id: uuidv4(),
    text: ollamaResponse.message.content,
    createdAt: ollamaResponse.created_at.valueOf(),
    author: {
      id: MessageRole.ASSISTANT,
    },
    type: 'text',
    role: MessageRole.ASSISTANT
  };
};

// get system prompt
const getSystemMessage = (text: string): CommonMessage => {
  return {
    id: uuidv4(),
    text,
    createdAt: Date.now(),
    author: {
      id: MessageRole.SYSTEM,
    },
    type: 'text',
    role: MessageRole.SYSTEM
  };
};

export { getTitleAi, getAssistantMessageFromOllama, getSystemMessage, getOllamaMessageFromChatMessage };