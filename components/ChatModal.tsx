import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { useOllamaStore } from '@/store/useOllamaStore';

const getModelName = (name: string) => name?.split(":")[0]

export const ChatModal = () => {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const { models, selectedModel, setSelectedModel, refreshModels } = useOllamaStore()
	const snapPoints = useMemo(() => ['25%'], []);

	const handleMenuPress = useCallback(() => {
		refreshModels()
		if (models.length > 0) {
			bottomSheetRef.current?.expand();
		}
	}, []);

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

	const handleSheetChange = useCallback((index: number) => {
		console.log('bottomSheet index changed:', index);
	}, []);

	const handleMenuItemPress = useCallback((modelName: string) => {
		// bottomSheetRef.current?.close();
		setSelectedModel(modelName)
	}, []);

	return (
		<>
			<Button mode={"text"} onPress={handleMenuPress} icon="chevron-down"	>
				{selectedModel ? <Text>{getModelName(selectedModel)}</Text> : <Text>Select Model</Text>}
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
				>
					<BottomSheetView style={styles.bottomSheetContent}>
						{models.map(model => (
							<Button key={model.name} icon={selectedModel === model.name ? "check" : undefined} mode={selectedModel === model.name ? "contained" : "outlined"} onPress={() => handleMenuItemPress(model.name)}>
								{getModelName(model.name)}
							</Button>
						))}
						<Button icon={"plus"} mode={"outlined"} onPress={() => { }}>
							add
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
		borderBottomColor: '#e0e0e0',
	},
	handleStyle: {
		backgroundColor: '#fff',
		borderTopLeftRadius: 15,
		borderTopRightRadius: 15,
	},
});