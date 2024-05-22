import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Card } from 'react-native-paper';
// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDrSb4tLwIq0Oh_7bsKst95Po3n20-i10Q",
  authDomain: "gym-market.firebaseapp.com",
  projectId: "gym-market",
  storageBucket: "gym-market.appspot.com",
  messagingSenderId: "229168445264",
  appId: "1:229168445264:web:ed0c5ddc2aeaa463d29e55",
  measurementId: "G-WHN1M0P7KC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth();

export default function Profile({navigation}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully!');
      navigation.navigate('Bottom')
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <>
          <View style={styles.signout}> 
            <TouchableOpacity onPress={handleLogout}>
              <Card>
                <Card.Content style={styles.signoutcontent}>
                  <Text style={styles.signoutTextcontent}>Sign out</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <Text>No user is logged in</Text>
      )}
    </View>
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
  title: {
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    
  },
  signout:{
    width:'80%',
    position:'absolute',
    bottom:10
  },
  signoutcontent:{
    backgroundColor:'#add8e6', 
    fontSize:20,
    alignItems:'center',
    
  },
  signoutTextcontent:{
    fontSize:20,
    fontWeight:'bold'
  }
});
