import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Card, Menu, Provider as PaperProvider, Switch } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import DarkModeContext from './settings/DarkMode'; // Adjust the path as necessary

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
  const { isDarkMode, toggleDarkMode } = useContext(DarkModeContext);
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
    <PaperProvider>
      <View style={[styles.container, isDarkMode && styles.darkContainer]}>
        <View style={styles.profileContainer}>
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
            contentStyle={[styles.menu, isDarkMode && styles.darkMenu]}
          >
            <Menu.Item onPress={takePicture} title="Take a Photo" titleStyle={styles.menuItem} />
            <Menu.Item onPress={pickImage} title="Choose from Library" titleStyle={styles.menuItem} />
          </Menu>
          <View style={styles.welcomeContainer}>
            <Text style={[styles.title, isDarkMode && styles.darkTitle]}>Welcome</Text>
            {user && <Text style={[styles.email, isDarkMode && styles.darkEmail]}>{user.email}</Text>}
          </View>
        </View>
        <View style={styles.bottomContainer}>
          {user && (
            <View style={styles.signout}>
              <TouchableOpacity onPress={handleLogout}>
                <Card>
                  <Card.Content style={[styles.signoutcontent, isDarkMode && styles.darkSignoutContent]}>
                    <Text style={styles.signoutTextcontent}>Sign out</Text>
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            </View>
          )}
          <View style={styles.darkModeToggle}>
            <Image source={require('../assets/images/ProfilePics/DarkMode.png')} style={styles.darkModeIcon} />
            <Text style={styles.darkModeText}>Dark Mode</Text>
            <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
          </View>

          {/* Edit Profile */}
          <TouchableOpacity style={styles.editProfileButton}>
            <Image source={require('../assets/images/Profile.png')} style={styles.editProfileIcon} />
            <Text style={styles.editProfileText}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // Light mode background color
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
  },
  darkContainer: {
    backgroundColor: '#333', // Dark mode background color
  },
  profileContainer: {
    width: 420,
    height: 200,
    backgroundColor: '#B3D8F6', // Light grey color for upper container
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: -20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  welcomeContainer: {
    marginLeft: 16,
  },
  title: {
    fontSize: 24,
    color: '#000', // Light mode text color
  },
  darkTitle: {
    color: '#fff', // Dark mode text color
  },
  email: {
    fontSize: 18,
    color: '#000', // Light mode text color
  },
  darkEmail: {
    color: '#fff', // Dark mode text color
  },
  bottomContainer: {
    flex: 1,
    width: 420,
    height: 900,
    alignItems: 'center',
    backgroundColor: '#D9E6F1', // Grey color for bottom container
    paddingVertical: 16,
    marginTop: -20,
    paddingTop: 420,
  },
  signout: {
    width: '80%',
    marginBottom: 16,
  },
  signoutcontent: {
    backgroundColor: '#add8e6',
    fontSize: 20,
    alignItems: 'center',
  },
  darkSignoutContent: {
    backgroundColor: '#666', // Dark mode background color for signout button
  },
  signoutTextcontent: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menu: {
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  darkMenu: {
    backgroundColor: '#444', // Dark mode background color for menu
  },
  menuItem: {
    fontSize: 16,
    color: '#333',
  },
  darkModeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 420,
    right: 20,
  },
  darkModeIcon: {
    width: 50,
    height: 50,
    marginRight: 30, // Decrease this value to move the icon closer to the text
    marginBottom: 10,
  },
  darkModeText: {
    fontSize: 16,
    color: '#000', // Light mode text color
    marginLeft: 5, // Decrease this value to move the text closer to the icon
    marginBottom: 10,
    marginRight: 150,
    fontWeight: 'bold',
  },
  editProfileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    bottom: 340,
    right: 220,
  },
  editProfileIcon: {
    width: 50,
    height: 50,
    marginRight:40,
  },
  editProfileText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000', // Light mode text color
  },
});
