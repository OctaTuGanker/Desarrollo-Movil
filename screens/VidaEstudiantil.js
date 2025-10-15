import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function VidaEstudiantil() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Vida Estudiantil / Cronograma</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18, fontWeight: 'bold' },
});
