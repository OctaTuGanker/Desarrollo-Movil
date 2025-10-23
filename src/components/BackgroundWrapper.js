// src/components/BackgroundWrapper.js
import React from 'react';
import { ImageBackground, StyleSheet } from 'react-native';

const BACKGROUND_IMAGE = require('../../assets/fondo.jpg'); // Ajusta la ruta si es necesario

const BackgroundWrapper = ({ children }) => {
  return (
    <ImageBackground 
      source={BACKGROUND_IMAGE} 
      style={styles.background} 
      // Usar "repeat" es clave para un patrón
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