import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { useChatStore } from '@/store/useChats'
import { i18n } from '@/util/l10n/i18n';
import { useAppTheme } from './ThemeProvider';


export const MessageEdit = () => {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ['40%'], []);
	const { colors: { surface, } } = useAppTheme()

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
	const handleSheetChange = (index: number) => {
		if (index === -1) {
			handleUpdateMessage()
		}
	};
	return (
		<>
			<BottomSheet
				ref={bottomSheetRef}
				index={-1}
				snapPoints={snapPoints}
				backdropComponent={renderBackdrop}
				onChange={handleSheetChange}
				enablePanDownToClose
				handleStyle={styles.handleStyle}
				backgroundStyle={{ backgroundColor: surface }}
			>
				<BottomSheetView style={styles.bottomSheetContent}>
					<TextInput
						mode="outlined"
						multiline
						style={styles.textInput}
						label={i18n.t("dialogEditMessageTitle")}
						onChangeText={setInputText}
						value={inputText}
						textAlignVertical='top'
					/>
					<Button icon={"check"} mode={"contained"} onPress={handleUpdateMessage}>
						update
					</Button>
				</BottomSheetView>
			</BottomSheet>
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