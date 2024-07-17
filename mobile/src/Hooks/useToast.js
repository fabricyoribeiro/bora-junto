import React from 'react';
import { View, Text } from 'react-native';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';  // Importe os componentes de Toast necessários, se aplicável

const useToastConfig = () => {
  const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: 'green', marginTop:50, elevation:100}}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 16,
          fontWeight: '400'
        }}
        text2Style={{
          fontSize: 14,
          fontWeight: '400'
        }}
      />
    ),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: 'red', marginTop:50, elevation:100}}
        
        text1Style={{
          fontSize: 16
        }}
        text2Style={{
          fontSize: 14
        }}
      />
    ),
    tomatoToast: ({ text1, props }) => (
      <View style={{ height: 60, width: '100%', backgroundColor: 'tomato' }}>
        <Text>{text1}</Text>
        <Text>{props.uuid}</Text>
      </View>
    )
  };

  const showToast = (text, type='success') => {
    Toast.show({
      type: `${type}`,
      text1: type === 'success' ? "Tudo certo!" : "Houve um erro",
      text2: `${text}`
    });
  }

  return {toastConfig, showToast};
};

export default useToastConfig;
