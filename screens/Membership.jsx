import React from 'react';
import { View, Image, StyleSheet, Dimensions, Text, ScrollView } from 'react-native';

const Membership = () => {
  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
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

    
        <View style={styles.planContainer}>
          <Text style={[styles.planText, styles.planName]}>One Entrance Package</Text>
          <Text style={styles.priceText}>$6.99</Text>

          <View style={styles.benefitContainer}>
            <Image
              source={require('../assets/images/Membership/checked.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.benefitText}>Duration: One Time Use</Text>
          </View>
          <View style={styles.benefitContainer}>
            <Image
              source={require('../assets/images/Membership/checked.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.benefitText}>Access to all gym facilities</Text>
          </View>
          <View style={styles.buyNowButton}>
            <Text style={styles.buyNowButtonText}>Add to Cart</Text>
          </View>
        </View>

     
        <View style={styles.planContainer}>
          <Text style={[styles.planText, styles.planName]}>Standard Package</Text>
          <Text style={styles.priceText}>$54.99</Text>

          <View style={styles.benefitContainer}>
            <Image
              source={require('../assets/images/Membership/checked.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.benefitText}>Duration: 1 Month</Text>
          </View>
          <View style={styles.benefitContainer}>
            <Image
              source={require('../assets/images/Membership/checked.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.benefitText}>Access to all gym facilities</Text>
          </View>
          <View style={styles.buyNowButton}>
            <Text style={styles.buyNowButtonText}>Add to Cart</Text>
          </View>
        </View>

        <View style={styles.planContainer}>
          <Text style={[styles.planText, styles.planName]}>Elite Membership</Text>
          <Text style={styles.priceText}>$135.99</Text>

          <View style={styles.benefitContainer}>
            <Image
              source={require('../assets/images/Membership/checked.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.benefitText}>Duration: 3 Months</Text>
          </View>
          <View style={styles.benefitContainer}>
            <Image
              source={require('../assets/images/Membership/checked.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.benefitText}>Access to all gym facilities</Text>
          </View>
          <View style={styles.buyNowButton}>
            <Text style={styles.buyNowButtonText}>Add to Cart</Text>
          </View>
        </View>

        <View style={styles.planContainer}>
          <Text style={[styles.planText, styles.planName]}>Ultimate Package</Text>
          <Text style={styles.priceText}>$516.99</Text>

          <View style={styles.benefitContainer}>
            <Image
              source={require('../assets/images/Membership/checked.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.benefitText}>Duration: 12 Months</Text>
          </View>
          <View style={styles.benefitContainer}>
            <Image
              source={require('../assets/images/Membership/checked.png')}
              style={styles.checkIcon}
            />
            <Text style={styles.benefitText}>Access to all gym facilities</Text>
          </View>
          <View style={styles.buyNowButton}>
            <Text style={styles.buyNowButtonText}>Add to Cart</Text>
          </View>
        </View>

          
          <View style={styles.guaranteeContainer}>
          <Text style={styles.guaranteeTitle}>Love It or Your Money Back</Text>
          <Text style={styles.guaranteeText}>
          Enjoy Our 30-Day Risk-Free Guarantee. We're confident you'll embrace your FlexZone journey. If within the first 30 days you're not experiencing a more vibrant, happier, healthier lifestyle, we'll refund your investment without hesitation.
          </Text>
        </View>

      </View>
    </ScrollView>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flexGrow: 1,
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
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
    height:300,
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
  benefitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
    marginTop:15,
  },
  planText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    fontFamily: 'Arial',
  },
  planName: {
    textAlign: 'left',
    marginTop: 10,
  },
  benefitText: {
    fontSize: 16,
    marginBottom: 10,
    marginTop:30,
  },
  buyNowButton: {
    alignSelf: 'center',
    backgroundColor: '#43A2EE',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 35,
  },
  buyNowButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  priceText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#43A2EE',
  },
  guaranteeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 50,
    marginTop:25,
    fontFamily: 'Klavika',
  },
  guaranteeText: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Arial',
    fontWeight:150,
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
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default Membership;
