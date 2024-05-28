import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const AboutUs = () => {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../assets/images/AboutUs/2.png')}
          style={styles.image}
          resizeMode="contain" // Change resizeMode to "contain"
        />
      </View>
      <View style={styles.contentContainer}>
        <Text style={styles.description}>
          Welcome to our online store! We're dedicated to providing you with
          the best products, with a focus on dependability, customer service,
          and uniqueness.
        </Text>
        <Text style={styles.description}>
          We hope you enjoy our products as much as we enjoy offering them to
          you. If you have any questions or comments, please don't hesitate to
          contact us.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    overflow: 'hidden',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  imageContainer: {
    height: 200,
    overflow: 'hidden',
  },
  image: {
    flex: 1,
    width: '100%', // Set width to 100%
  },
  contentContainer: {
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: '#666',
  },
});

export default AboutUs;
