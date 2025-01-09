### Thanks to below Apps

- [react-native-chat-ui](https://github.com/flyerhq/react-native-chat-ui)
- [ollama-app](https://github.com/JHubi1/ollama-app)


### tips
Ollama's API doesn't actually support Server-Sent Events (SSE) natively. Instead, it uses a line-delimited JSON streaming format,but the React Native’s fetch API struggles with handling stream responses so far , so I can only display the feedback when the response completed.