import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const BACKGROUND_IMAGE = require('../../assets/fondo.jpg'); 
const BackgroundWrapper = ({ children }) => {
  return (
    <ImageBackground 
      source={BACKGROUND_IMAGE} 
      style={styles.background} 
      resizeMode="repeat" 
    >
      {children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1, 
    width: '100%',
    height: '100%',
  },
});

export default BackgroundWrapper;