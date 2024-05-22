import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity, ScrollView, Text, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';
import Slideshow from 'react-native-image-slider-show';

const { width: screenWidth } = Dimensions.get('window');

export default function Home() {
  const navigation = useNavigation();

  const handlePress = () => {
    navigation.navigate('Home');
  };

  const handleNavigation = () => {
    navigation.navigate('Membership');
  };

  const images = [
    { url: require('./../assets/images/SALES/smartwatch.png') },
    { url: require('./../assets/images/SALES/1.png') },
    { url: require('./../assets/images/SALES/30.png') },
  ];

  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.container}>
        <View style={styles.blueContainer}>
          <View style={styles.searchContainer}>
            <Searchbar placeholder="Search" style={styles.searchbar} />
            <TouchableOpacity onPress={() => console.log("Button pressed")} style={styles.iconContainer}>
              <Image source={require('../assets/images/reorder-horizontal.png')} style={styles.iconImage} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.membershipContainer}>
          <TouchableOpacity onPress={handleNavigation}>
            <Image source={require('../assets/images/Membership/try.png')} style={styles.membershipImage} />
          </TouchableOpacity>
        </View>

        <View style={styles.topContainer}>
          <Text style={styles.specialPicksText}>Special Picks for You!</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
            <View style={styles.topCategoriesContainer}>
              {[
                { name: 'Creatine', image: require('../assets/images/BestPicks/creatine.png') },
                { name: 'Mass Gainer', image: require('../assets/images/BestPicks/mass-gainer.jpg') },
                { name: 'Omega 3', image: require('../assets/images/BestPicks/omega3.webp') },
                { name: 'Vitamin D3', image: require('../assets/images/BestPicks/vitamind3.webp') },
                { name: 'Smart Watch', image: require('../assets/images/BestPicks/smartwatch.png') },
              ].map((category, index) => (
                <View key={index} style={styles.topCategoryItem}>
                  <Image source={category.image} style={styles.topCarouselImage} />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        <View style={[styles.slideableContainer, { height: 200 }]}>
  <Slideshow
    dataSource={images}
    height={200} // Adjust the height here
    arrowSize={20}
    indicatorSize={20}
    overlay={false}
    indicatorColor="#CCCCCC"
    indicatorSelectedColor="#FFFFFF"
    containerStyle={styles.slideshowContainer}
    titleStyle={styles.slideshowTitle}
    captionStyle={styles.slideshowCaption}
  />
</View>


        <View style={styles.categoriesContainer}>
          <Text style={styles.categoryHeaderText}>Shop by Category</Text>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
            <View style={styles.categoryItemsContainer}>
              {[
                { name: 'Gym', image: require('../assets/images/Categories/gym.png') },
                { name: 'Protein Powder', image: require('../assets/images/Categories/protein-powder.png') },
                { name: 'T-shirt', image: require('../assets/images/Categories/tshirt.png') },
                { name: 'Smartwatch', image: require('../assets/images/Categories/smartwatch.png') },
                { name: 'Towels', image: require('../assets/images/Categories/towels.png') },
              ].map((category, index) => (
                <View key={index} style={styles.categoryItem}>
                  <Image source={category.image} style={styles.carouselImage} />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 0,
    backgroundColor: '#F1FAFE',
  },
  touchable: {
    width: '100%',
    alignItems: 'center',
  },
  blueContainer: {
    height: 80,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  searchbar: {
    backgroundColor: 'white',
    color: 'black',
    flex: 1,
  },
  iconContainer: {
    padding: 10,
  },
  iconImage: {
    width: 40,
    height: 40,
  },
  topContainer: {
    backgroundColor: 'white',
    marginTop: 50,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  specialPicksText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  categoryHeaderText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  topCategoriesContainer: {
    flexDirection: 'row',
  },
  topCategoryItem: {
    alignItems: 'center',
    marginHorizontal: 20,
    width: 100, // Ensure all items have a consistent width
  },
  topCarouselImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 5, // Space between the image and the text
  },
  slideableContainer: {
    backgroundColor: '#FFF',
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  slideshowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoriesContainer: {
    backgroundColor: 'white',
    marginTop: 20,
    marginBottom: 20, // Ensure spacing is consistent
    paddingHorizontal: 10,
  },
  categoryItemsContainer: {
    flexDirection: 'row', // Ensure items are displayed horizontally
  },
  categoryItem: {
    alignItems: 'center',
    marginHorizontal: 12, // Changed from 20 to 10 for category items
    width: 100, // Ensure all items have a consistent width
  },
  carouselImage: {
    width: 60,
    height: 60,
  },
  categoryText: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  membershipContainer: {
    width: screenWidth, // Slightly smaller than the screen width for better padding
    alignSelf: 'center', // Center the container
    marginBottom: -50,
    marginTop:-22,
    height: 215, // Set a fixed height for the container
    justifyContent: 'center', // Center the image vertically within the container
  },
  membershipImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain', // Ensure the image fits within the container without being cut off
  },
});
