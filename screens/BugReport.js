import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { ref, push } from 'firebase/database';
import { database } from './firebase'; // Adjust the import path based on your project structure

const BugReport = ({ onSubmitBugReport }) => {
  const [bugDescription, setBugDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');

  const submitBugReport = () => {
    const bugReport = { bugDescription, stepsToReproduce };
    
    const bugReportsRef = ref(database, 'bugReports');
    push(bugReportsRef, bugReport)
      .then(() => {a
        console.log('Bug report submitted successfully');
        setBugDescription('');
        setStepsToReproduce('');
      })
      .catch((error) => {
        console.error('Error submitting bug report:', error);
      });
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.innerContainer}>
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
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  innerContainer: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    width: '100%',
    height: 120,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#fff',
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.2, // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowRadius: 3, // iOS shadow
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 3, // Android shadow
    shadowColor: '#000', // iOS shadow
    shadowOpacity: 0.2, // iOS shadow
    shadowOffset: { width: 0, height: 2 }, // iOS shadow
    shadowRadius: 3, // iOS shadow
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BugReport;
