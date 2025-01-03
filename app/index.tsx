import { useActionSheet } from '@expo/react-native-action-sheet'
import { Chat, MessageType, defaultTheme } from '@flyerhq/react-native-chat-ui'
import { PreviewData } from '@flyerhq/react-native-link-preview'
import React, { useState } from 'react'
import DocumentPicker from 'react-native-document-picker'
import FileViewer from 'react-native-file-viewer'
import * as ImagePicker from 'expo-image-picker';

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import data from '../message.json'
import { useSnackBarStore } from '@/store/useSnackbar'

const App = () => {
  const snackState = useSnackBarStore()

  const { showActionSheetWithOptions } = useActionSheet()
  const [messages, setMessages] = useState<MessageType.Any[]>(data)
  const user = { id: '06c33e8b-e835-4736-80f4-63f44b66666c' }

  const addMessage = (message: MessageType.Any) => {
    setMessages([message, ...messages])
  }

  const handleAttachmentPress = () => {
    showActionSheetWithOptions(
      {
        options: ['Photo', 'File', 'Cancel'],
        cancelButtonIndex: 2,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            handleImageSelection()
            break
          case 1:
            handleFileSelection()
            break
        }
      }
    )
  }

  const handleFileSelection = async () => {
    try {
      const response = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.allFiles],
      })
      const fileMessage: MessageType.File = {
        author: user,
        createdAt: Date.now(),
        id: uuidv4(),
        mimeType: response.type ?? undefined,
        name: response.name,
        size: response.size ?? 0,
        type: 'file',
        uri: response.uri,
      }
      addMessage(fileMessage)
    } catch { }
  }

  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
    } else {
      alert('You did not select any image.');
    }
    const response = result.assets?.[0]

    if (response?.base64) {
      const imageMessage: MessageType.Image = {
        author: user,
        createdAt: Date.now(),
        height: response.height,
        id: uuidv4(),
        name: response.fileName ?? response.uri?.split('/').pop() ?? '🖼',
        size: response.fileSize ?? 0,
        type: 'image',
        uri: response.uri,
        width: response.width,
      }
      addMessage(imageMessage)
    }
  }

  const handleMessagePress = async (message: MessageType.Any) => {
    if (message.type === 'file') {
      try {
        await FileViewer.open(message.uri, { showOpenWithDialog: true })
      } catch { }
    }
  }

  const handlePreviewDataFetched = ({
    message,
    previewData,
  }: {
    message: MessageType.Text
    previewData: PreviewData
  }) => {
    setMessages(
      messages.map<MessageType.Any>((m) =>
        m.id === message.id ? { ...m, previewData } : m
      )
    )
  }

  const handleSendPress = (message: MessageType.PartialText) => {
    const textMessage: MessageType.Text = {
      author: user,
      createdAt: Date.now(),
      id: uuidv4(),
      text: message.text,
      type: 'text',
    }
    addMessage(textMessage)
    snackState.setSnack({ visible: true, message: message.text })
  }

  return (
    <Chat
      messages={messages}
      onAttachmentPress={handleAttachmentPress}
      onMessagePress={handleMessagePress}
      onPreviewDataFetched={handlePreviewDataFetched}
      onSendPress={handleSendPress}
      user={user}
      theme={{
        ...defaultTheme,
        colors: {
          ...defaultTheme.colors,
          inputText: "#000",
          inputBackground: "#efefef"
        }
      }}
    />
  )
}

export default App

