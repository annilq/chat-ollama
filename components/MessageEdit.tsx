import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { useChatStore } from '@/store/useChats'


export const MessageEdit = () => {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ['40%'], []);

	const { updateMessage, editMessageId, chat } = useChatStore()

	const [inputText, setInputText] = useState<string | undefined>("")

	useEffect(() => {
		if (editMessageId) {
			const message = chat?.messages.find(message => message.id === editMessageId)!
			if (message.type === "text") {
				setInputText(message.text)
			} else if (message.type === "image") {
				setInputText(message.metadata?.text)
			}
			bottomSheetRef.current?.expand();
		}
	}, [editMessageId])

	const renderBackdrop = useCallback(
		(props: any) => (
			<BottomSheetBackdrop
				{...props}
				appearsOnIndex={0}
				disappearsOnIndex={-1}
				pressBehavior="close"
			/>
		),
		[]
	);

	const handleUpdateMessage = () => {
		
		if (editMessageId && inputText) {
			updateMessage(editMessageId, inputText);
			setInputText("");
			bottomSheetRef.current?.close();
		}
	};
	const handleSheetChange = useCallback((index: number) => {
		if (index === -1) {
			handleUpdateMessage()
		}
	}, []);
	return (
		<>
			{/* <Portal> */}
			<BottomSheet
				ref={bottomSheetRef}
				index={-1}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
				onChange={handleSheetChange}
				enablePanDownToClose
				handleStyle={styles.handleStyle}
			>
				<BottomSheetView style={styles.bottomSheetContent}>
					<TextInput
						mode="outlined"
						multiline
						style={styles.textInput}
						label="behavior"
						onChangeText={setInputText}
						value={inputText}
						textAlignVertical='top'
					/>
					<Button icon={"check"} mode={"contained"} onPress={handleUpdateMessage}>
						update
					</Button>
				</BottomSheetView>
			</BottomSheet>
			{/* </Portal> */}
		</>
	);
};

const styles = StyleSheet.create({
	bottomSheetContent: {
		gap: 8,
		flex: 1,
		flexWrap: "wrap",
		flexDirection: "column",
		paddingHorizontal: 16,
		paddingBottom: 32
	},

	handleStyle: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
	textInput: {
		width: "100%",
		flex: 1,
		borderColor: '#ccc',
		paddingHorizontal: 8,
	},
});