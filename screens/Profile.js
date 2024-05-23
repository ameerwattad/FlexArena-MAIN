import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Card } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker'; // Import from expo-image-picker

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
  const [modalVisible, setModalVisible] = useState(false);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const pickImage = async () => {
    // Request permission to access the image library
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access the camera roll is required!");
      return;
    }

    // Launch the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      setModalVisible(false);
    }
  };

  const takePicture = async () => {
    // Request permission to access the camera
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("Permission to access the camera is required!");
      return;
    }

    // Launch the camera
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.assets[0].uri);
      setModalVisible(false);
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
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      {user ? (
        <>
          <View style={styles.profileIcon}>
            <TouchableOpacity onPress={() => setModalVisible(true)}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} />
              ) : (
                <Image source={require('../assets/images/Profile.png')} style={styles.profileImage} />
              )}
            </TouchableOpacity>
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

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Pressable style={[styles.modalButton, styles.takePhotoButton]} onPress={takePicture}>
              <Text style={styles.modalButtonText}>Take a Photo</Text>
            </Pressable>
            <Pressable style={[styles.modalButton, styles.choosePhotoButton]} onPress={pickImage}>
              <Text style={styles.modalButtonText}>Choose a photo from Library</Text>
            </Pressable>
            <Pressable
              style={[styles.modalButton, styles.closeButton]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.modalButtonText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalButton: {
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
    backgroundColor: '#add8e6',
  },
  modalButtonText: {
    fontSize: 18,
    textAlign: 'center',
  },
  takePhotoButton: {
    backgroundColor: '#add8e6',
  },
  choosePhotoButton: {
    backgroundColor: '#add8e6',
  },
  closeButton: {
    backgroundColor: '#ff6347', // Red color for cancel button
  },
});
