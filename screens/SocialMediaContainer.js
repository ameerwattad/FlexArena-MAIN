import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Linking } from 'react-native';

const SocialMediaContainer = () => {
  // Replace these counts with your actual follower counts
  const facebookFollowers = 10000;
  const twitterFollowers = 15000;
  const instagramFollowers = 25000;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Follow Us</Text>
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity style={styles.icon} onPress={() => openSocialMediaProfile('facebook')}>
          <Image
            source={require('../assets/images/SocialMedia/facebook.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>{facebookFollowers} followers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={() => openSocialMediaProfile('twitter')}>
          <Image
            source={require('../assets/images/SocialMedia/twitter.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>{twitterFollowers} followers</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.icon} onPress={() => openSocialMediaProfile('instagram')}>
          <Image
            source={require('../assets/images/SocialMedia/instagram.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>{instagramFollowers} followers</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const openSocialMediaProfile = (platform) => {
  // Implement navigation to respective social media profiles here
  switch(platform) {
    case 'facebook':
      // Navigate to Facebook profile
      Linking.openURL('https://www.facebook.com/ameer.watted.1/');
      break;
    case 'twitter':
      // Navigate to Twitter profile
      Linking.openURL('https://x.com/ameerwattad20');
      break;
    case 'instagram':
      // Open Instagram profile
      Linking.openURL('https://www.instagram.com/wattad_ameer/?hl=en');
      break;
    default:
      console.log(`No action defined for ${platform}`);
  }
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  socialIconsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginLeft: 10,
    alignItems: 'center',
  },
  iconImage: {
    width: 30,
    height: 30,
  },
  iconText: {
    marginTop: 5,
    fontSize: 12,
    color: '#666',
  },
});

export default SocialMediaContainer;
