import React, { useState, useContext } from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import DarkModeContext from './settings/DarkMode'; // Adjust the path as necessary
import { getAuth, reauthenticateWithCredential, updatePassword, updateEmail, updateProfile, EmailAuthProvider } from 'firebase/auth';

export default function ProfileEdit({ navigation }) {
  const { isDarkMode } = useContext(DarkModeContext);
  const auth = getAuth();

  // Check if user is signed in
  const user = auth.currentUser;
  if (!user) {
    // Handle scenario where user is not signed in
    // Redirect to login screen or handle as appropriate
    return null; // Or display a message to prompt the user to sign in
  }

  const [name, setName] = useState(user.displayName || '');
  const [email, setEmail] = useState(user.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState(null);

  const handleChangePassword = async () => {
    try {
      // Create credential using EmailAuthProvider
      const credential = EmailAuthProvider.credential(email, currentPassword);

      // Reauthenticate user with current password
      await reauthenticateWithCredential(user, credential);

      // Change password
      await updatePassword(user, newPassword);

      // Prompt the user that the password has been successfully changed
      Alert.alert(
        'Password Changed',
        'Your password has been successfully changed.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleChangeEmail = async () => {
    try {
      // Reauthenticate user with current password
      const credential = EmailAuthProvider.credential(email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update email
      await updateEmail(user, email);

      // Prompt the user that the email has been successfully updated
      Alert.alert(
        'Email Updated',
        'Your email has been successfully updated.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setError(error.message);
    }
  };

  const handleSaveProfile = async () => {
    try {
      // Update display name
      await updateProfile(user, { displayName: name });

      // Prompt the user that the profile has been successfully updated
      Alert.alert(
        'Profile Updated',
        'Your profile has been successfully updated.',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <ScrollView>
        <View style={styles.profile}>
          <View style={styles.profileAvatarWrapper}>
            <Image
              alt=""
              source={require('../assets/images/Profile.png')}
              style={styles.profileAvatar}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Current Password"
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="New Password"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
          />

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity onPress={handleChangePassword}>
            <View style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Change Password</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleChangeEmail}>
            <View style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Change Email</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleSaveProfile}>
            <View style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save Profile</Text>
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
    backgroundColor: '#fff',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  profile: {
    padding: 24,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarWrapper: {
    marginBottom: 24,
  },
  profileAvatar: {
    width: 100,
    height: 100,
    borderRadius: 9999,
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
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
