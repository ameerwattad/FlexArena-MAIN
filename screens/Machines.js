import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Machines() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Machines</Text>
      <View style={styles.imageContainer}>
        <Image source={require('./../assets/test.jpg')} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.5)', 'white']}
          locations={[0, 0.5, 1]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    marginBottom: 20,
  },
  imageContainer: {
    position: 'relative',
    width: 200,
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '100%',
  },
});
