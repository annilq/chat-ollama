import * as React from 'react';
import { View } from 'react-native';
import { Divider, TextInput } from 'react-native-paper';

const Setting = () => {
  const [text, setText] = React.useState("");

  return (
    <View>
      <TextInput
        mode="outlined"
        label="主机地址"
        placeholder="Type something"
        right={<TextInput.Affix text="/100" />}
        left={<TextInput.Affix text="/100" />}
      />
      <Divider />
    </View>
  );
};

export default Setting;