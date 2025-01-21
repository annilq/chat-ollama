import { i18n } from '@/util/l10n/i18n';
import React, { useState } from 'react';
import { List } from 'react-native-paper';
import { useAppTheme } from './ThemeProvider';

export const Tips = () => {
  const { colors } = useAppTheme();
  // Sample tips data - you can replace with your own
  const tips = [
    i18n.t("tip1"),
    i18n.t("tip2"),
    i18n.t("tip3"),
    i18n.t("tip4"),
    i18n.t("tip5"),
  ];

  const [selectedTipIndex, setSelectedTipIndex] = useState(0);

  return (
    <List.Item
      titleNumberOfLines={0}
      titleStyle={{
        fontSize: 12,
        color: colors.secondary,
      }}
      title={`${i18n.t("tipPrefix")}${tips[selectedTipIndex]}`}
      rippleColor={"transparent"}
      left={props => <List.Icon {...props} icon="lightbulb-on-outline" />}
      onPress={() => {
        if (selectedTipIndex === tips.length-1) {
          setSelectedTipIndex(0)
        } else {
          setSelectedTipIndex(selectedTipIndex + 1)
        }
      }}
    />
  )
};

export default Tips;