import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DarkModeContext from './settings/DarkMode';

export default function Cart() {
  const { isDarkMode } = useContext(DarkModeContext);

  return (
    <View style={[styles.container, isDarkMode && styles.darkContainer]}>
      <Text style={[styles.text, isDarkMode && styles.darkText]}>Cart</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Light mode background color
  },
  darkContainer: {
    backgroundColor: '#333', // Dark mode background color
  },
  text: {
    fontSize: 20,
    color: '#000', // Light mode text color
  },
  darkText: {
    color: '#fff', // Dark mode text color
  },
});
