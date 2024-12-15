import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Constants from 'expo-constants';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

const apiKey = Constants.expoConfig.extra.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

// Function to check if the input is related to gym or supplements
const isGymOrSupplementRelated = (input) => {
  const keywords = [
    'gym', 'workout', 'exercise', 'fitness', 'routine', 
    'training', 'muscle', 'weightlifting', 'cardio', 'yoga', 
    'supplement', 'protein', 'creatine', 'pre-workout', 'vitamins',
    'nutrition', 'diet', 'health', 'supplements', 'stretching',
    'bodybuilding', 'crossfit', 'running', 'endurance', 'flexibility',
    'hi', 'hello', 'thank you', 'bye', 'yasmin', 'ameera'
  ];
  
  const phrases = [
    'how to build muscle',
    'best supplements for energy',
    'tips for weight loss',
    'beginner workout plan',
    'protein intake for athletes',
    'how to improve stamina',
    'healthy meal prep ideas',
    'recovery after exercise',
    'benefits of creatine',
    'fitness goals'
  ];

  const lowerCaseInput = input.toLowerCase();
  return (
    keywords.some(keyword => lowerCaseInput.includes(keyword)) ||
    phrases.some(phrase => lowerCaseInput.includes(phrase))
  );
};

const Chatbot = () => {
  const [history, setHistory] = useState([{ role: 'model', text: 'Looking for supplements or advice? Ask me anything ☺️🫶' }]);
  const [input, setInput] = useState('');
  const [chatSession, setChatSession] = useState(null);

  const handleSend = async () => {
    if (input.trim() === '') return;

    // Validate the input
    if (!isGymOrSupplementRelated(input)) {
      const newHistory = [
        ...history,
        { role: 'user', text: input },
        { role: 'model', text: 'I can only answer questions about gym workouts and supplements. Please ask me something related to these topics.' },
      ];
      setHistory(newHistory);
      setInput('');
      return;
    }

    const newHistory = [...history, { role: 'user', text: input }];
    setHistory(newHistory);
    setInput('');

    try {
      let session = chatSession;
      if (!session) {
        session = model.startChat({
          generationConfig,
          history: newHistory.slice(1).map((message) => ({
            role: message.role,
            parts: [{ text: message.text }],
          })),
        });
        setChatSession(session);
      }

      const result = await session.sendMessage(input);
      const botResponse = await result.response.text();

      setHistory((prevHistory) => [
        ...prevHistory,
        { role: 'model', text: botResponse },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.innerContainer}
      enableOnAndroid
      extraHeight={20}
      extraScrollHeight={20}
    >
      <View style={styles.history}>
        {history.map((message, index) => (
          <Text key={index} style={styles[message.role]}>
            {message.text}
          </Text>
        ))}
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type your question..."
        />

        <TouchableOpacity style={styles.button} onPress={handleSend}>
          <Text style={{ color: 'white' }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },
  history: {
    flex: 1,
    marginBottom: 10,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    fontSize: 18,
  },
  model: {
    alignSelf: 'flex-start',
    backgroundColor: '#ECECEC',
    padding: 10,
    borderRadius: 10,
    marginBottom: 5,
    fontSize: 18,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  button: {
    height: 40,
    backgroundColor: 'blue',
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Chatbot;
