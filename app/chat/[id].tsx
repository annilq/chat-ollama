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

// Add a new interface for pending image
interface PendingImage {
  uri: string;
  base64: string;
}

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
        display: "flex",
        gap: 4,
        flexDirection: "row",
        backgroundColor: defaultTheme.colors.inputBackground,
        borderRadius: 20,
        paddingInline: 20,
        paddingBlock: 10,
        borderWidth: 1,
        overflow: 'hidden',
      }}
    >
      {message.type === "text" ? <Text style={{ color: "#fff" }}>{message.text}</Text> : child}
      {message.loading ? <ActivityIndicator animating={true} /> : false}
    </View>
  )
}

const ChatApp = () => {
  const { id } = useLocalSearchParams<{ id: string }>()
  const snackState = useSnackBarStore()
  const { checkService, initialize } = useOllamaStore()
  const { sendMessage, chat, isSending, initializeChats, getChat, deleteMessage } = useChatStore()
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
      base64: true, // Enable base64
    });
    
    if (!result.canceled && result.assets?.[0]) {
      const asset = result.assets[0];
      setPendingImage({
        uri: asset.uri,
        base64: asset.base64 || '',
      });
      
      // Show a snackbar to indicate image is ready
      // useSnackBarStore.getState().setSnack({
      //   visible: true,
      //   message: "Image added - type your message and send"
      // });
    }
  }


  const handleMessagePress = async (message: MessageType.Any) => {
    if (message.type === 'file') {
      try {
        await FileViewer.open(message.uri, { showOpenWithDialog: true })
      } catch { }
    } else if (message.type === 'text') {

      await Clipboard.setString(message.text)

      // useSnackBarStore.getState().setSnack({
      //   visible: true,
      //   message: "message is copy to Clipboard"
      // });
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

    // If we have a pending image, send both image and text
    if (pendingImage) {
      const combinedMessage = {
        ...textMessage,
        images: [pendingImage.base64],
        // You might want to add the image preview to the UI
        imageUri: pendingImage.uri,
      }
      sendMessage(combinedMessage)
      setPendingImage(null) // Clear the pending image
    } else {
      // Send text-only message as before
      sendMessage(textMessage)
    }
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
            // Copy title logic here if needed
            break;
          case 1:
            handleDelete(message.id);
            break;
        }
      }
    );
  };

  // Add a state for pending image
  const [pendingImage, setPendingImage] = useState<PendingImage | null>(null);

  return (
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
        readOnly: !!isSending,
        placeholder: pendingImage 
          ? "Type your question about the image..." 
          : "Type your message...",

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
  )
}

export default ChatApp

