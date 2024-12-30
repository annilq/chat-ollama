import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet } from 'react-native';
import { Button, IconButton } from 'react-native-paper';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';
import { useOllama } from '@/chatutil/OllamaContext';

export const ChatModal = () => {
	const bottomSheetRef = useRef<BottomSheet>(null);
	const { models } = useOllama()
	const snapPoints = useMemo(() => ['25%'], []);

	const handleMenuPress = useCallback(() => {
		bottomSheetRef.current?.expand();
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

	const handleMenuItemPress = useCallback((action: string) => {
		bottomSheetRef.current?.close();
		switch (action) {
			case 'new':
				console.log('New chat');
				break;
			case 'continue':
				console.log('Continue chat');
				break;
		}
	}, []);

	return (
		<>
			<IconButton
				icon="chevron-down"
				size={24}
				onPress={handleMenuPress}
			/>

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
							<Button key={model.name} mode="outlined" onPress={() => handleMenuItemPress('Pressed')}>
								{model.name}
							</Button>
						))}

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