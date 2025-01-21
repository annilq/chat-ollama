import React from 'react';
import { Divider, DividerProps } from 'react-native-paper';

export default (props: DividerProps) => {
  return <Divider bold style={{ marginVertical: 12 }} {...props} />;
};
