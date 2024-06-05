import React, { useContext } from 'react';
import { View, Image, StyleSheet, Dimensions, Text, ScrollView, TouchableOpacity } from 'react-native';
import SocialMediaContainer from './SocialMediaContainer';
import { useNavigation } from '@react-navigation/native';
import DarkModeContext from './settings/DarkMode';  // Import DarkModeContext

const Membership = () => {
  const navigation = useNavigation();
  const { isDarkMode } = useContext(DarkModeContext);  // Use DarkModeContext

  const addToCart = (product) => {
    navigation.navigate('Cart', { product: { ...product, quantity: 1 } });
  };

  const products = [
    {
      id: 1,
      name: 'One Entrance Package',
      price: 6.99,
      image: require('../assets/images/Membership/one.png'),
      duration: 'One Time Use',
      facilities: 'Access to all gym facilities'
    },
    {
      id: 2,
      name: 'Standard Package',
      price: 54.99,
      image: require('../assets/images/Membership/standard.png'),
      duration: '1 Month',
      facilities: 'Access to all gym facilities'
    },
    {
      id: 3,
      name: 'Elite Membership',
      price: 135.99,
      image: require('../assets/images/Membership/elite.png'),
      duration: '3 Months',
      facilities: 'Access to all gym facilities'
    },
    {
      id: 4,
      name: 'Ultimate Package',
      price: 516.99,
      image: require('../assets/images/Membership/ultimate.png'),
      duration: '12 Months',
      facilities: 'Access to all gym facilities'
    },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={[styles.container, isDarkMode ? styles.darkContainer : null]}>
        <View style={styles.imageContainer}>
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

        {products.map(product => (
          <View key={product.id} style={[styles.planContainer, isDarkMode ? styles.darkPlanContainer : null]}>
            <Text style={[styles.planText, styles.planName, isDarkMode ? styles.darkPlanText : null]}>{product.name}</Text>
            <Text style={[styles.priceText, isDarkMode ? styles.darkPriceText : null]}>${product.price}</Text>

            <View style={styles.benefitContainer}>
              <Image
                source={require('../assets/images/Membership/checked.png')}
                style={styles.checkIcon}
              />
              <Text style={[styles.benefitText, isDarkMode ? styles.darkBenefitText : null]}>Duration: {product.duration}</Text>
            </View>
            <View style={styles.benefitContainer}>
              <Image
                source={require('../assets/images/Membership/checked.png')}
                style={styles.checkIcon}
              />
              <Text style={[styles.benefitText, isDarkMode ? styles.darkBenefitText : null]}>{product.facilities}</Text>
            </View>
            <TouchableOpacity style={[styles.buyNowButton, isDarkMode ? styles.darkBuyNowButton : null]} onPress={() => addToCart(product)}>
              <Text style={[styles.buyNowButtonText, isDarkMode ? styles.darkBuyNowButtonText : null]}>Add to Cart</Text>
            </TouchableOpacity>
          </View>
        ))}

        <View style={[styles.guaranteeContainer, isDarkMode ? styles.darkGuaranteeContainer : null]}>
          <Text style={[styles.guaranteeTitle, isDarkMode ? styles.darkGuaranteeTitle : null]}>Love It or Your Money Back</Text>
          <Text style={[styles.guaranteeText, isDarkMode ? styles.darkGuaranteeText : null]}>
            Enjoy Our 30-Day Risk-Free Guarantee. We're confident you'll embrace your FlexZone journey. If within the first 30 days you're not experiencing a more vibrant, happier, healthier lifestyle, we'll refund your investment without hesitation.
          </Text>
        </View>
        <SocialMediaContainer />
      </View>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
  },
  darkContainer: {
    backgroundColor: '#333',
  },
  imageContainer: {
    width: windowWidth,
    alignItems: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: windowWidth * 0.7,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlayTextTop: {
    fontFamily: 'Rubik',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  overlayTextBottom: {
    fontSize: 16,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  planContainer: {
    marginTop: 50,
    width: 300,
    height: 300,
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  darkPlanContainer: {
    backgroundColor: '#444',
  },
  benefitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    marginTop: 15,
  },
  planText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Arial',
  },
  darkPlanText: {
    color: '#E0E0E0',
  },
  planName: {
    textAlign: 'left',
    marginTop: 10,
  },
  benefitText: {
    fontSize: 16,
    marginBottom: 10,
    marginTop: 30,
  },
  darkBenefitText: {
    color: '#E0E0E0',
  },
  buyNowButton: {
    alignSelf: 'center',
    backgroundColor: '#43A2EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 35,
  },
  darkBuyNowButton: {
    backgroundColor: '#005BBB',
  },
  buyNowButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  darkBuyNowButtonText: {
    color: '#E0E0E0',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#43A2EE',
  },
  darkPriceText: {
    color: '#80BFFF',
  },
  guaranteeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 50,
    marginTop: 25,
    fontFamily: 'Klavika',
  },
  darkGuaranteeTitle: {
    color: '#E0E0E0',
  },
  guaranteeText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Arial',
    fontWeight: '150',
  },
  darkGuaranteeText: {
    color: '#E0E0E0',
  },
  guaranteeContainer: {
    marginTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 30,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    }
  },
  darkGuaranteeContainer: {
    backgroundColor: '#444',
  },
});

export default Membership;
