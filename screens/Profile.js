import React, { useState, useEffect, useContext } from 'react';
import { SafeAreaView, View, ScrollView, Text, TouchableOpacity, Switch, Image, StyleSheet, Alert, Modal } from 'react-native';
import { auth, storage, database } from './firebase';  
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { ref as databaseRef, get } from 'firebase/database';
import FeatherIcon from 'react-native-vector-icons/Feather';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator'; 
import DarkModeContext from './settings/DarkMode';
import BugReport from './BugReport';
import ContactUsScreen from './ContactUsScreen';
import ProfileEdit from './ProfileEdit';
import Wishlist from './Wishlist'; 

export default function Profile({ navigation }) {
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [image, setImage] = useState(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); 
  const [form, setForm] = useState({
    darkMode: false,
    emailNotifications: true,
    pushNotifications: false,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const imageURL = await fetchProfileImage(user.uid);
        setImage(imageURL);
        const fetchedUsername = await fetchUsername(user.uid);
        setUsername(fetchedUsername);

        const fetchedBio = await fetchBio(user.uid);
        setBio(fetchedBio);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchUsername = async (userId) => {
    try {
      const userRef = databaseRef(database, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        return userData.username;
      }
      return 'Guest';
    } catch (error) {
      console.error('Error fetching username:', error);
      return 'Guest';
    }
  };

  const fetchBio = async (userId) => {
    try {
      const userRef = databaseRef(database, `users/${userId}`);
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        const userData = snapshot.val();
        return userData.bio;
      }
      return 'No Bio';
    } catch (error) {
      console.error('Error fetching bio:', error);
      return 'No Bio';
    }
  };

  const uploadProfileImage = async (imageUri, userId) => {
    try {
      const compressedUri = await compressImage(imageUri); 
      const response = await fetch(compressedUri);
      const blob = await response.blob();
      const imageURLRef = storageRef(storage, `profileImages/${userId}`);
      await uploadBlob(imageURLRef, blob);
      console.log('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const uploadBlob = async (ref, blob) => {
    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(ref, blob);
      task.on('state_changed',
        () => { },
        error => {
          reject(error);
        },
        () => {
          resolve();
        }
      );
    });
  };

  const fetchProfileImage = async (userId) => {
    try {
      const imageURLRef = storageRef(storage, `profileImages/${userId}`);
      const url = await getDownloadURL(imageURLRef);
      return url;
    } catch (error) {
      console.error('Error fetching profile image:', error);
      return null;
    }
  };

  const compressImage = async (uri) => {
    try {
      const compressedImage = await ImageManipulator.manipulateAsync(
        uri,
        [{ resize: { width: 1000 } }], 
        { compress: 0.5, format: 'jpeg' } 
      );
      return compressedImage.uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      return uri; 
    }
  };

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
      if (user) {
        uploadProfileImage(result.assets[0].uri, user.uid);
      }
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
      if (user) {
        uploadProfileImage(result.assets[0].uri, user.uid);
      }
    }
  };

  const showImagePickerOptions = () => {
    Alert.alert(
      "Select an option",
      "Choose from where you want to select the image",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Choose from Library",
          onPress: pickImage,
        },
        {
          text: "Take a Photo",
          onPress: takePicture,
        },
      ],
      { cancelable: true }
    );
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
    <SafeAreaView style={[styles.container, isDarkMode ? styles.darkContainer : null]}>
      <View style={[styles.profile, isDarkMode ? styles.darkProfile : null]}>
        <TouchableOpacity onPress={() => setModalVisible(true)}>
          <View style={styles.profileAvatarWrapper}>
            <Image
              alt=""
              source={image ? { uri: image } : require('../assets/images/Profile.png')}
              style={styles.profileAvatar}
            />
            <TouchableOpacity onPress={showImagePickerOptions}>
              <View style={styles.profileAction}>
                <FeatherIcon color="#fff" name="edit-3" size={15} />
              </View>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>

        <View>
          <Text style={[styles.profileName, isDarkMode ? styles.darkProfileName : null]}>{username}</Text>
          <Text style={[styles.profileAddress, isDarkMode ? styles.darkProfileAddress : null]}>{bio}</Text>
        </View>
      </View>


      <ScrollView>
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.darkSectionTitle : null]}>Preferences</Text>

          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ProfileEdit')}>
            <View style={[styles.rowIcon, { backgroundColor: '#32c759' }]}>
              <FeatherIcon color="#fff" name="user" size={20} />
            </View>
            <Text style={[styles.rowLabel, isDarkMode ? styles.darkRowLabel : null]}>Edit Profile</Text>
            <View style={styles.rowSpacer} />
            <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
          </TouchableOpacity>

          <View style={styles.row}>
            <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
              <FeatherIcon color="#fff" name="moon" size={20} />
            </View>
            <Text style={[styles.rowLabel, isDarkMode ? styles.darkRowLabel : null]}>Dark Mode</Text>
            <View style={styles.rowSpacer} />
            <Switch
              onValueChange={toggleDarkMode}
              value={isDarkMode}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.darkSectionTitle : null]}>Favorites & Purchases</Text>

          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Wishlist')}>
            <View style={[styles.rowIcon, { backgroundColor: '#ff0055' }]}>
              <FeatherIcon color="#fff" name="heart" size={20} />
            </View>
            <Text style={[styles.rowLabel, isDarkMode ? styles.darkRowLabel : null]}>Wishlist</Text>
            <View style={styles.rowSpacer} />
            <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('Orders')}>
            <View style={[styles.rowIcon, { backgroundColor: '#4caf50' }]}>
              <FeatherIcon color="#fff" name="shopping-bag" size={20} />
            </View>
            <Text style={[styles.rowLabel, isDarkMode ? styles.darkRowLabel : null]}>Orders</Text>
            <View style={styles.rowSpacer} />
            <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
          </TouchableOpacity>
        </View>



        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.darkSectionTitle : null]}>Resources</Text>

          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('BugReport')}>
            <View style={[styles.rowIcon, { backgroundColor: '#8e8d91' }]}>
              <FeatherIcon color="#fff" name="slack" size={20} />
            </View>
            <Text style={[styles.rowLabel, isDarkMode ? styles.darkRowLabel : null]}>Bug Report</Text>
            <View style={styles.rowSpacer} />
            <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, isDarkMode ? styles.darkSectionTitle : null]}>Feedback</Text>

          <TouchableOpacity style={styles.row} onPress={() => navigation.navigate('ContactUsScreen')}>
            <View style={[styles.rowIcon, { backgroundColor: '#007afe' }]}>
              <FeatherIcon color="#fff" name="message-circle" size={20} />
            </View>
            <Text style={[styles.rowLabel, isDarkMode ? styles.darkRowLabel : null]}>Contact Us</Text>
            <View style={styles.rowSpacer} />
            <FeatherIcon color="#C6C6C6" name="chevron-right" size={20} />
          </TouchableOpacity>

        </View>

        {user && (
          <View style={styles.signoutContainer}>
            <TouchableOpacity onPress={handleLogout}>
              <View style={[styles.signoutButton, isDarkMode ? styles.darkSignoutButton : null]}>
                <Text style={[styles.signoutText, isDarkMode ? styles.darkSignoutText : null]}>Sign out</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <Modal visible={modalVisible} transparent={true}>
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.modalBackground} onPress={() => setModalVisible(false)}>
            <Image
              source={image ? { uri: image } : require('../assets/images/Profile.png')}
              style={styles.modalImage}
            />
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  darkContainer: {
    flex: 1,
    backgroundColor: '#333',
  },
  profile: {
    padding: 24,
    backgroundColor: '#fff',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkProfile: {
    padding: 24,
    backgroundColor: '#222',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileAvatarWrapper: {
    position: 'relative',
  },
  profileAvatar: {
    width: 72,
    height: 72,
    borderRadius: 9999,
  },
  profileAction: {
    position: 'absolute',
    right: -4,
    bottom: -10,
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 9999,
    backgroundColor: '#007bff',
  },
  profileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: '600',
    color: '#414d63',
    textAlign: 'center',
  },
  darkProfileName: {
    marginTop: 20,
    fontSize: 19,
    fontWeight: '600',
    color: '#e0e0e0',
    textAlign: 'center',
  },
  profileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: '#989898',
    textAlign: 'center',
  },
  darkProfileAddress: {
    marginTop: 5,
    fontSize: 16,
    color: '#b0b0b0',
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#c8c8c8',
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  darkSectionTitle: {
    paddingVertical: 12,
    fontSize: 12,
    fontWeight: '600',
    color: '#9e9e9e', 
    textTransform: 'uppercase',
    letterSpacing: 1.1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',

    justifyContent: 'flex-start',
    height: 50,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginBottom: 12,
    paddingLeft: 12,
    paddingRight: 12,
  },
  rowIcon: {
    width: 32,
    height: 32,
    borderRadius: 9999,
    marginRight: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: '#0c0c0c', 
  },
  darkRowLabel: {
    fontSize: 17,
    fontWeight: '400',
    color: '#010101', 
  },
  rowSpacer: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  signoutContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  signoutButton: {
    backgroundColor: '#ff3b30',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  darkSignoutButton: {
    backgroundColor: '#cc0000',
  },
  signoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkSignoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalBackground: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '90%',
    height: '90%',
    resizeMode: 'contain',
  },
});
