### plan to do
1. when user select a file or a photo 
   1. send it to ollama with default prompt(user can config)
   2. send it next time with the text message(if ollam can remember the context ,this step is no need)
   3. if ollama understand the file ,do not send the file every time,just send the content

### Thanks to below Apps

- [react-native-chat-ui](https://github.com/flyerhq/react-native-chat-ui)
- [ollama-app](https://github.com/JHubi1/ollama-app)


### tips
Ollama's API doesn't actually support Server-Sent Events (SSE) natively.Instead, it uses a line-delimited JSON streaming format, So I can't use ```react-native-sse``` to get stream Data ,and the React Native’s fetch API struggles with handling stream responses so far , so I can only display the feedback when the response completed.