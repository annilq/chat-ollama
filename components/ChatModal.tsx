import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, View } from 'react-native';
import { IconButton, Text, TouchableRipple } from 'react-native-paper';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Portal } from '@gorhom/portal';

export const ChatModal = () => {

	const bottomSheetRef = useRef<BottomSheet>(null);

	// 底部菜单的固定点位
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
			/>
		),
		[]
	);

	const handleSheetChange = useCallback((index: number) => {
		// 处理底部菜单状态变化
	}, []);

	const handleMenuItemPress = useCallback((action: string) => {
		bottomSheetRef.current?.close();
		switch (action) {
			case 'new':
				// 处理新对话
				break;
			case 'continue':
				// 处理继续对话
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
				>
					<View style={styles.bottomSheetContent}>
						<TouchableRipple
							onPress={() => handleMenuItemPress('new')}
							style={styles.menuItem}
						>
							<Text>新对话</Text>
						</TouchableRipple>
						<TouchableRipple
							onPress={() => handleMenuItemPress('continue')}
							style={styles.menuItem}
						>
							<Text>继续对话</Text>
						</TouchableRipple>
					</View>
				</BottomSheet>
			</Portal>
		</>
	);
};

const styles = StyleSheet.create({
	bottomSheetContent: {
		flex: 1,
		paddingHorizontal: 16,
	},
	menuItem: {
		paddingVertical: 16,
		borderBottomWidth: 1,
		borderBottomColor: '#e0e0e0',
	},
}); 