import { useActionSheet } from '@expo/react-native-action-sheet'
import { Chat, MessageType, defaultTheme } from '@flyerhq/react-native-chat-ui'
import { PreviewData } from '@flyerhq/react-native-link-preview'
import React, { ReactNode, useCallback, useEffect, useState } from 'react'
import DocumentPicker from 'react-native-document-picker'
import FileViewer from 'react-native-file-viewer'
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams } from 'expo-router';
import Clipboard from '@react-native-clipboard/clipboard';
import { ActivityIndicator, View, Text, Image, Alert } from 'react-native'

import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

import { useSnackBarStore } from '@/store/useSnackbar'
import { useOllamaStore } from '@/store/useOllamaStore'
import { CommonMessage, useChatStore } from '@/store/useChats'
import { IconButton } from 'react-native-paper'
import { MessageEdit } from '@/components/MessageEdit'

const renderBubble = ({
  child,
  message,
  nextMessageInGroup,
}: {
  child: ReactNode
  message: Partial<CommonMessage>
  nextMessageInGroup: boolean
}) => {
  return (
    <View
      style={{
        borderRadius: 20,
        overflow: 'hidden',
        position: "relative",
        ...message.type === "text" && {
          display: "flex",
          gap: 4,
          flexDirection: "row",
          paddingInline: 20,
          paddingBlock: 10,
          borderWidth: 1,
          backgroundColor: defaultTheme.colors.inputBackground,
        }
      }}
    >
      {message.type === "text" ? <Text style={{ color: "#fff" }}>{message.text}</Text> : child}
      {message.loading ? (
        <View
          style={{
            ...message.type === "image" && {
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }
          }}>
          <ActivityIndicator animating={true} />
        </View>
      ) : false}
    </View>
  )
}

const ChatApp = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const snackState = useSnackBarStore()
  const { checkService, initialize } = useOllamaStore()
  const { sendMessage, chat, isSending, initializeChats, getChat, deleteMessage, showMessageInput } = useChatStore()
  const { showActionSheetWithOptions } = useActionSheet()

  // we set a constant userId 
  // when we persist chat we can know which message is user
  const user = { id: "user" }

  const messages = chat?.messages || []

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
      sendMessage(fileMessage)
    } catch { }
  }


  const handleImageSelection = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
      base64: true,
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
        uri: `data:image/jpeg;base64,${response.base64}`,
        width: response.width,
      }
      sendMessage(imageMessage)
    }
  }


  const handleMessagePress = async (message: MessageType.Any) => {
    if (message.type === 'file') {
      try {
        await FileViewer.open(message.uri, { showOpenWithDialog: true })
      } catch { }
    } else if (message.type === 'text') {

      await Clipboard.setString(message.text)

      useSnackBarStore.getState().setSnack({
        visible: true,
        message: "message is copy to Clipboard"
      });
    }
  }

  const handlePreviewDataFetched = ({
    message,
    previewData,
  }: {
    message: MessageType.Text
    previewData: PreviewData
  }) => {
    sendMessage(
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

    sendMessage(textMessage)
  }

  const handleCancelRequest = useCallback(() => {
    useOllamaStore.getState().ollama.cancelRequest();
  }, []);

  useEffect(() => {
    const host = 'http://localhost:11434'; // You can make this configurable
    initialize(host);
    initializeChats()
    // Set up health check interval
    const interval = setInterval(() => {
      checkService();
    }, 10000); // Check every 10 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Now id will be 'new' for new chats or the actual chatId for existing chats
    getChat(id === 'new' ? undefined : id)
  }, [id])

  const handleDelete = (messageId: string) => {
    Alert.alert(
      "Delete Message",
      "Are you sure you want to delete this message?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMessage(messageId)
        }
      ]
    );
  };

  const handleLongPress = (message: MessageType.Any) => {
    showActionSheetWithOptions(
      {
        options: ["Edit", "Delete", "Cancel"],
        destructiveButtonIndex: 1,
        cancelButtonIndex: 2,
      },
      (selectedIndex) => {
        switch (selectedIndex) {
          case 0:
            showMessageInput(message.id)
            break;
          case 1:
            handleDelete(message.id);
            break;
        }
      }
    );
  };


  return (
    <>
      <Chat
        messages={messages}
        onAttachmentPress={handleAttachmentPress}
        onMessagePress={handleMessagePress}
        onMessageLongPress={handleLongPress}
        onPreviewDataFetched={handlePreviewDataFetched}
        onSendPress={handleSendPress}
        renderBubble={renderBubble}
        sendButtonVisibilityMode="always"
        user={user}
        emptyState={() => (
          <Image
            source={require('../../assets/images/logo.png')}
            style={{ height: 50, width: 38 }}
          />)}
        textInputProps={{
          readOnly: !!isSending
        }}
        theme={{
          ...defaultTheme,
          colors: {
            ...defaultTheme.colors,
            primary: "#fff",
            inputText: "#000",
            inputBackground: "#efefef"
          },
          icons: {
            sendButtonIcon: () => !isSending ? (
              <IconButton icon={"send-outline"} />
            ) : (
              <IconButton icon={"pause-circle"} onPress={handleCancelRequest} />
            )
          }
        }}
      />
      <MessageEdit />
    </>
  )
}

export default ChatApp

