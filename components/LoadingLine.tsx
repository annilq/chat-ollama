import React, { useEffect } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

 export const LoadingLine = () => {
  const width = new Animated.Value(0);

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(width, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(width, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        })
      ]).start(() => animate());
    };

    animate();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.line,
          {
            width: width.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%']
            })
          }
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 2,
    backgroundColor: '#eee',
    overflow: 'hidden',
  },
  line: {
    height: '100%',
    backgroundColor: '#2196F3',
  }
});

export default LoadingLine;
