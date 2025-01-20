import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-paper';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { useOllamaStore } from '@/store/useOllamaStore';
import { i18n } from '@/util/l10n/i18n';
import { useAppTheme } from './ThemeProvider';
import { useConfigStore } from '@/store/useConfig';
import useChatStore from '@/store/useChats';

const getModelName = (name: string) => name?.split(":")[0]

export const ChatModal = () => {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const snapPoints = useMemo(() => ['25%'], []);
	const { colors: { surface, } } = useAppTheme()

	const { models, refreshModels } = useOllamaStore()
	const { setModel, chat } = useChatStore()
	const { config: { showModelTag } } = useConfigStore()
	const [currentModel, setCurrentModel] = useState(chat?.model)

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
							<Button key={model.name} icon={currentModel === model.name ? "check" : undefined} mode={currentModel === model.name ? "contained" : "outlined"} onPress={() => handleMenuItemPress(model.name)}>
								{showModelTag ? model.name : getModelName(model.name)}
							</Button>
						))}
						<Button icon={"plus"} mode={"outlined"} onPress={() => { }}>
							{i18n.t("modelDialogAddModel")}
						</Button>
					</BottomSheetView>
				</BottomSheet>
			</Portal>
		</>
	);
};

const styles = StyleSheet.create({
	bottomSheetContent: {
		gap: 8,
		flex: 1,
		flexWrap: "wrap",
		flexDirection: "row",
		paddingHorizontal: 16,
	},
	menuItem: {
		paddingVertical: 16,
		borderBottomWidth: 1,
	},
	handleStyle: {
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
});