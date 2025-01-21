import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Dialog, TextInput } from 'react-native-paper';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { useOllamaStore } from '@/store/useOllamaStore';
import { i18n } from '@/util/l10n/i18n';
import { useAppTheme } from './ThemeProvider';
import { useConfigStore } from '@/store/useConfig';
import useChatStore from '@/store/useChats';
import { getStyles } from '@/styles/style';
import Divider from './Divider';

const getModelName = (name: string) => name?.split(":")[0]

export const ChatModal = () => {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const bottomAddModelSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ['25%'], []);
	const [visible, setVisible] = useState(false);

	const hideDialog = () => setVisible(false);

	const { colors: { surface, } } = useAppTheme()

	const { models, refreshModels, pullModel, isLoading } = useOllamaStore()
	const { setModel, chat } = useChatStore()
	const { config: { showModelTag } } = useConfigStore()

	const [currentModel, setCurrentModel] = useState(chat?.model)
	const [inputText, setInputText] = useState<string | undefined>("")

	useEffect(() => {
		if (chat?.model) {
			setCurrentModel(chat.model)
		}
	}, [chat?.model])

	const handleMenuPress = useCallback(() => {
		refreshModels()

		if (models.length > 0) {
			bottomSheetRef.current?.expand();
		}
	}, [models]);

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

	const handleSheetChange = (index: number) => {
		if (index === -1 && currentModel !== chat?.model) {
			setModel(currentModel!)
		}
	};

	const handleMenuItemPress = useCallback((modelName: string) => {
		setCurrentModel(modelName)
	}, []);

	return (
		<>
			<Button mode={"text"} onPress={handleMenuPress} icon="chevron-down"	>
				{chat?.model ? <Text>{showModelTag ? chat?.model : getModelName(chat?.model)}</Text> : <Text>{i18n.t("noSelectedModel")}</Text>}
			</Button>
			<Portal>
				<BottomSheet
					ref={bottomSheetRef}
					index={-1}
					snapPoints={snapPoints}
					onChange={handleSheetChange}
					backdropComponent={renderBackdrop}
					enablePanDownToClose
					handleStyle={styles.handleStyle}
					backgroundStyle={{ backgroundColor: surface }}
				>
					<BottomSheetView style={styles.bottomSheetContent}>
						{models.map(model => (
							<Button
								key={model.name}
								style={styles.menuItem}
								icon={currentModel === model.name ? "check" : undefined}
								mode={currentModel === model.name ? "contained" : "outlined"}
								onPress={() => handleMenuItemPress(model.name)}
							>
								{showModelTag ? model.name : getModelName(model.name)}
							</Button>
						))}
						<Button
							icon={"plus"}
							mode={"outlined"}
							onPress={() => {
								bottomSheetRef.current?.close()
								bottomAddModelSheetRef.current?.expand()
							}}>
							{i18n.t("modelDialogAddModel")}
						</Button>
					</BottomSheetView>
				</BottomSheet>
				<BottomSheet
					ref={bottomAddModelSheetRef}
					index={-1}
					snapPoints={snapPoints}
					backdropComponent={renderBackdrop}
					enablePanDownToClose
					handleStyle={styles.handleStyle}
					backgroundStyle={{ backgroundColor: surface }}
				>
					<BottomSheetView style={styles.bottomSheetContent}>
						<View style={[...getStyles("flex flex-col w-full"), { gap: 8 }]}>
							<Text style={getStyles("font-bold")}>{i18n.t("modelDialogAddPromptTitle")}</Text>
							<Divider style={{ marginVertical: 4 }} />
							<Text>{i18n.t("modelDialogAddPromptDescription")}</Text>
							<TextInput
								mode="outlined"
								value={inputText}
								onChangeText={setInputText}
								style={{ width: "100%" }}
								right={
									<TextInput.Icon
										icon={isLoading ? "loading" : "content-save"}
										onPress={() => {
											if (inputText) {
												setVisible(true)
											}
										}} />
								}
							/>
						</View>
					</BottomSheetView>
				</BottomSheet>
				<Dialog visible={visible} onDismiss={hideDialog}>
					<Dialog.Title style={getStyles("text-lg")}>{i18n.t("modelDialogAddAssuranceTitle", { model: inputText })}</Dialog.Title>
					<Dialog.Content>
						<Text>{i18n.t("modelDialogAddAssuranceDescription", { model: inputText })}</Text>
					</Dialog.Content>
					<Dialog.Actions>
						<Button onPress={hideDialog}>{i18n.t("cancel")}</Button>
						<Button onPress={() => { pullModel(inputText!); hideDialog() }}>{i18n.t("confirm")}</Button>
					</Dialog.Actions>
				</Dialog>
			</Portal>
		</>
	);
};


const styles = StyleSheet.create({
	bottomSheetContent: {
		gap: 8,
		flexWrap: "wrap",
		flexDirection: "row",
		paddingHorizontal: 16,
	},
	menuItem: {
		paddingHorizontal: 0,
		borderBottomWidth: 1,
	},
	handleStyle: {
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
});