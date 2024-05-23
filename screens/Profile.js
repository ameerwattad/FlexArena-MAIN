import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Card, Menu, Provider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

const firebaseConfig = {
  apiKey: "AIzaSyDrSb4tLwIq0Oh_7bsKst95Po3n20-i10Q",
  authDomain: "gym-market.firebaseapp.com",
  projectId: "gym-market",
  storageBucket: "gym-market.appspot.com",
  messagingSenderId: "229168445264",
  appId: "1:229168445264:web:ed0c5ddc2aeaa463d29e55",
  measurementId: "G-WHN1M0P7KC"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();

export default function Profile({ navigation }) {
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access the camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      setMenuVisible(false);
    }
  };

  const takePicture = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access the camera is required!");
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      setMenuVisible(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log('User logged out successfully!');
      navigation.navigate('Bottom');
    } catch (error) {
      console.error('Logout error:', error.message);
    }
  };

  return (
    <Provider>
      <View style={styles.container}>
        <Text style={styles.title}>Profile</Text>
        {user ? (
          <>
            <View style={styles.profileIcon}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchor={
                  <TouchableOpacity onPress={() => setMenuVisible(true)}>
                    {image ? (
                      <Image source={{ uri: image }} style={styles.profileImage} />
                    ) : (
                      <Image source={require('../assets/images/Profile.png')} style={styles.profileImage} />
                    )}
                  </TouchableOpacity>
                }
                contentStyle={styles.menu}
              >
                <Menu.Item onPress={takePicture} title="Take a Photo" titleStyle={styles.menuItem} />
                <Menu.Item onPress={pickImage} title="Choose from Library" titleStyle={styles.menuItem} />
              </Menu>
            </View>
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
    </Provider>
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
  profileIcon: {
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  signout: {
    width: '80%',
    position: 'absolute',
    bottom: 10,
  },
  signoutcontent: {
    backgroundColor: '#add8e6',
    fontSize: 20,
    alignItems: 'center',
  },
  signoutTextcontent: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menu: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  menuItem: {
    fontSize: 16,
    color: '#333',
  },
});
