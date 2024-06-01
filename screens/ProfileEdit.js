import React, { useState, useContext, useEffect } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DarkModeContext from './settings/DarkMode';
import { getAuth, reauthenticateWithCredential, updatePassword, EmailAuthProvider, updateProfile } from 'firebase/auth';
import { getDatabase, ref, set } from 'firebase/database';

export default function ProfileEdit({ navigation }) {
  const { isDarkMode } = useContext(DarkModeContext);
  const auth = getAuth();
  const [user, setUser] = useState(auth.currentUser);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      if (user) {
        loadData(user.uid);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    if (user) {
      setName(user.displayName || '');
      setEmail(user.email || '');
    }
  }, [user]);

  const loadData = async (uid) => {
    try {
      const savedData = await AsyncStorage.getItem(`userData_${uid}`);
      if (savedData) {
        const userData = JSON.parse(savedData);
        setName(userData.name || '');
        setEmail(userData.email || '');
        setPhoneNumber(userData.phoneNumber || '');
        setAddress(userData.address || '');
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const saveDataToStorage = async () => {
    try {
      if (!user) return;
      const userData = {
        name,
        email,
        phoneNumber,
        address,
      };
      await AsyncStorage.setItem(`userData_${user.uid}`, JSON.stringify(userData));
    } catch (error) {
      console.error('Error saving user data:', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const credential = EmailAuthProvider.credential(email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      const db = getDatabase();
      const userRef = ref(db, `users/${user.uid}`);

      await set(userRef, {
        username: name,
        email,
        phoneNumber,
        address,
      });

      await updateProfile(user, { displayName: name });

      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      saveDataToStorage();

      Alert.alert('Profile Updated', 'Your profile has been successfully updated.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.profile}>
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Name"
            value={name}
            onChangeText={setName}
            placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
          />
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
          />
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Current Password"
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
          />
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="New Password (leave blank to keep current password)"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
            placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
          />
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Phone Number"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
          />
          <TextInput
            style={[styles.input, isDarkMode && styles.darkInput]}
            placeholder="Address"
            value={address}
            onChangeText={setAddress}
            placeholderTextColor={isDarkMode ? '#ccc' : '#999'}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity onPress={handleSaveChanges}>
            <View style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  darkContainer: {
    backgroundColor: '#121212',
  },
  scrollContainer: {
    padding: 24,
  },
  profile: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  darkInput: {
    borderColor: '#555',
    color: '#fff',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
