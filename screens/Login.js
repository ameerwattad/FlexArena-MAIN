import { View, Text, TextInput, Button, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { auth, database } from './firebase'; // Import initialized Firebase services
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { ref, set, get } from 'firebase/database';

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication, username, setUsername }) => {
  return (
    <>
      <View style={styles.container}>
        <View style={styles.authContainer}>
          <Image source={require('./../assets/images/newlogo.png')} style={styles.logo} />
          <Text style={styles.title}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
          {!isLogin && (
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
            />
          )}
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Password"
            secureTextEntry
          />
          <View style={styles.buttonContainer}>
            <Button title={isLogin ? 'Sign In' : 'Sign Up'} onPress={handleAuthentication} color="#3498db" />
          </View>
          <View style={styles.bottomContainer}>
            <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Sign In'}
            </Text>
          </View>
        </View>
      </View>
    </>
  );
};

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigation = useNavigation();

  const handleAuthentication = async () => {
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        console.log('User signed in successfully!');
        const currentUser = auth.currentUser;
        const userId = currentUser ? currentUser.uid : null;
        if (userId) {
          const adminRef = ref(database, `admins/${userId}`);
          const snapshot = await get(adminRef);
          if (snapshot.exists()) {
            console.log('Admin signed in');
            navigation.navigate('AdminDashboard');
          } else {
            console.log('Regular user signed in');
            navigation.navigate('Bottomafterlogin');
          }
        }
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        await set(ref(database, 'users/' + auth.currentUser.uid), {
          email: auth.currentUser.email,
          username: username
        });
        console.log('User created successfully!');
        navigation.navigate('Bottomafterlogin');
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  const handleGoogleSignIn = () => {
    // Implement Google Sign-In functionality here
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <AuthScreen
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        isLogin={isLogin}
        setIsLogin={setIsLogin}
        handleAuthentication={handleAuthentication}
        username={username}
        setUsername={setUsername}
      />
      <View>
        <Text style={styles.orText}> ────────  OR  ────────</Text>
      </View>
      <View style={styles.googleContainer}>
        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
          <Image source={require('./../assets/images/google_logo.png')} style={styles.googleIcon} />
          <Text style={styles.googleButtonText}>Sign In with Google</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 16,
    padding: 8,
    borderRadius: 4,
  },
  buttonContainer: {
    marginBottom: 16,
  },
  toggleText: {
    color: '#3498db',
    textAlign: 'center',
  },
  bottomContainer: {
    marginTop: 20,
  },
  orText: {
    marginTop: 30,
    textAlign: 'center',
  },
  googleContainer: {
    marginTop: 50,
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderColor: '#747775',
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    width: 250,
  },
  googleIcon: {
    height: 20,
    width: 20,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#1f1f1f',
    fontSize: 14,
    fontWeight: '500',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 16,
  },
});
