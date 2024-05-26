import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

const BugReport = () => {
  const [bugDescription, setBugDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');

  const submitBugReport = () => {
    // Logic to submit bug report
    console.log('Submitting bug report...');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bug Report</Text>
      <TextInput
        style={styles.input}
        placeholder="Describe the bug..."
        multiline
        numberOfLines={4}
        value={bugDescription}
        onChangeText={text => setBugDescription(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Steps to reproduce..."
        multiline
        numberOfLines={4}
        value={stepsToReproduce}
        onChangeText={text => setStepsToReproduce(text)}
      />
      <TouchableOpacity style={styles.submitButton} onPress={submitBugReport}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BugReport;
