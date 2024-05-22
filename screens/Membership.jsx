import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text } from 'react-native';

const Membership = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/Membership/membership.webp')}
        style={styles.image}
        resizeMode="cover"
      />
      
      <View style={styles.overlay}>
        <Text style={styles.overlayTextTop}>Let's Talk Fitness Memberships</Text>
        <Text style={styles.overlayTextBottom}>
          No matter what your fitness level is, 2 to 4 workouts a week is all you need to maximize your results at Orangetheory. Let's find the fitness membership option that works best for you.
        </Text>
      </View>

    </View>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1,
    alignItems: 'center',
    backgroundColor:'#F3F3F3',
  },
  image: {
    width: windowWidth,
    height: windowWidth * 0.7, // Adjust the height as needed
    borderRadius: 20,
  },
  overlay: {
    position: 'absolute',
    top:0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black overlay
  },
  overlayTextTop: {
    fontFamily:'Rubik',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 50,
    marginTop:30,
    color: '#FFFFFF', // White color for the text
  },
  overlayTextBottom: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF', // White color for the text
    marginTop:20,
  },
  whiteContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
  },

});

export default Membership;
