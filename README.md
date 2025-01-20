### plan to do
1. markdown render
2. add model

### Thanks to below Apps

- [react-native-chat-ui](https://github.com/flyerhq/react-native-chat-ui)
- [ollama-app](https://github.com/JHubi1/ollama-app)
- [use-svgs-react-native](https://blog.logrocket.com/use-svgs-react-native-tutorial/)
- [custom-theming-with-react-native-paper-expo-and-expo-router](https://hemanshum.medium.com/the-ultimate-guide-to-custom-theming-with-react-native-paper-expo-and-expo-router-8eba14adcab3)

### tips
Ollama's API doesn't actually support Server-Sent Events (SSE) natively.Instead, it uses a line-delimited JSON streaming format, So I can't use ```react-native-sse``` to get stream Data ,and the React Native’s fetch API struggles with handling stream responses so far , so I can only display the feedback when the response completed.